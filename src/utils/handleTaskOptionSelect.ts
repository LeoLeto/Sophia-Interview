import { ChatMessage, GptFormData, TaskFormData } from "../types";
import { askNextField } from "./handleTaskFieldFlow/askNextField";
import { saveCurrentTaskField } from "./handleTaskFieldFlow/saveCurrentTaskField";
import { sendTaskCompleteOrNext } from "./handleTaskFieldFlow/sendTaskCompleteOrNext";

export function handleTaskOptionSelect({
  msgIndex,
  optionIndex,
  messages,
  setMessages,
  setFormData,
  taskInProgress,
  setTaskInProgress,
  // indexCurrentTaskField,
  setindexCurrentTaskField,
}: {
  msgIndex: number;
  optionIndex: number;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>;
  taskInProgress: string | null;
  setTaskInProgress: (taskKey: string | null) => void;
  indexCurrentTaskField: number;
  setindexCurrentTaskField: React.Dispatch<React.SetStateAction<number>>;
}) {
  // console.log("[handleTaskOptionSelect] triggered", {
  //   msgIndex,
  //   optionIndex,
  //   taskInProgress,
  // });

  const optionMessage = messages[msgIndex];

  if (optionMessage.type !== "options") {
    console.error("Message at index is not an options message");
    return;
  }

  if (!optionMessage.meta || !optionMessage.meta.field) {
    console.error("No meta.field found on options message");
    return;
  }

  const field = optionMessage.meta.field;
  console.log(" field: ", field);
  const selectedOption = (optionMessage.content as { options: string[] })
    .options[optionIndex];

  // ✅ Mark selected option in chat history
  setMessages((prev) => {
    const updated = [...prev];
    const msg = updated[msgIndex];
    if (msg.type === "options" && msg.content && "selected" in msg.content) {
      msg.content.selected = optionIndex;
    }
    return [...updated];
  });

  if (field === "task") {
    const selectedTask = selectedOption;

    // ✅ Initialize formData entry if needed
    setFormData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [selectedTask]: prev.tasks[selectedTask] ?? {
          frequency: null,
          duration: null,
          difficulty: null,
          addedValue: null,
          implicitPriority: null,
        },
      },
    }));

    // ✅ Start task flow
    setTaskInProgress(selectedTask);
    setindexCurrentTaskField(0);

    // Ask first field (frequency)
    askNextField({
      taskKey: selectedTask,
      fieldKey: "frequency",
      setMessages,
    });

    return;
  }

  // ✅ For other fields (frequency, duration, etc.)
  if (!taskInProgress) {
    console.error("No task in progress when selecting field option");
    return;
  }

  // ✅ Save selected value for current field
  saveCurrentTaskField({
    taskKey: taskInProgress,
    fieldKey: field as keyof TaskFormData,
    selectedValue: optionIndex,
    setFormData,
  });

  // ✅ Decide whether to continue or finish task
  sendTaskCompleteOrNext({
    taskKey: taskInProgress,
    fieldKey: field as keyof TaskFormData, // instead of relying on index
    setindexCurrentTaskField,
    setTaskInProgress,
    setMessages,
  });
}
