import { handleNameStep } from "./handleNameStep";
import { handlePositionStep } from "./handlePositionStep";
import { ChatMessage, GptFormData } from "../../types";
import { handleTaskFieldsFlow } from "../handleTaskFieldFlow/handleTaskFieldFlow";
import { askNextField } from "../handleTaskFieldFlow/askNextField";

export const handleSendMessage = async (
  newMessage: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>,
  indexIdentityStep: number,
  setindexIdentityStep: React.Dispatch<React.SetStateAction<number>>,
  taskInProgress: string | null,
  setTaskInProgress: (taskKey: string | null) => void,
  indexCurrentTaskField: number,
  setindexCurrentTaskField: React.Dispatch<React.SetStateAction<number>>,
  formData: GptFormData,
  setFetchedTasks: React.Dispatch<React.SetStateAction<string[]>>,
  fetchedTasks: string[]
) => {
  const userMsg: ChatMessage = {
    type: "text",
    role: "user",
    content: newMessage,
  };

  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  try {
    if (indexIdentityStep === 1) {
      return handleNameStep(
        newMessage,
        setMessages,
        setFormData,
        setindexIdentityStep
      );
    }

    if (indexIdentityStep === 2) {
      return await handlePositionStep(
        newMessage,
        setMessages,
        setFormData,
        setindexIdentityStep,
        setFetchedTasks
      );
    }

    if (indexIdentityStep === 3 && !taskInProgress) {
      // The user typed a task manually instead of selecting one
      const customTask = newMessage.trim();
      if (!customTask) return;

      // ✅ Update form data
      setFormData((prev) => ({
        ...prev,
        tasks: {
          ...prev.tasks,
          [customTask]: {
            frequency: null,
            duration: null,
            difficulty: null,
            addedValue: null,
            implicitPriority: null,
          },
        },
      }));

      // ✅ Mark the last task options as selected (-1 means typed)
      setMessages((prev) => {
        const updated = [...prev];
        const lastOptionsIndex = [...updated]
          .reverse()
          .findIndex(
            (msg) => msg.type === "options" && msg.meta?.field === "task"
          );

        if (lastOptionsIndex !== -1) {
          const actualIndex = updated.length - 1 - lastOptionsIndex;
          const prevMsg = updated[actualIndex];

          // ✅ Check that content is an object with options
          if (
            prevMsg.type === "options" &&
            typeof prevMsg.content === "object" &&
            "options" in prevMsg.content
          ) {
            updated[actualIndex] = {
              ...prevMsg,
              content: {
                ...prevMsg.content,
                selected: -1, // Mark as custom typed task
              },
            };
          }
        }

        return updated;
      });

      setTaskInProgress(customTask);
      setindexCurrentTaskField(0);

      askNextField({
        taskKey: customTask,
        fieldKey: "frequency",
        setMessages,
      });

      return;
    }

    if (taskInProgress) {
      return handleTaskFieldsFlow({
        newMessage,
        setMessages,
        setFormData,
        taskInProgress,
        setTaskInProgress,
        indexCurrentTaskField,
        setindexCurrentTaskField,
        formData,
        fetchedTasks,
      });
    }
  } catch (error) {
    console.error("handleSendMessage error:", error);
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        role: "assistant",
        content: "Lo siento, ocurrió un error al responder.",
      },
    ]);
  } finally {
    setLoading(false);
  }
};
