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
  // setTaskInProgressFromUserSelection: (options: string[]) => void,
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
        // setTaskInProgressFromUserSelection,
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
