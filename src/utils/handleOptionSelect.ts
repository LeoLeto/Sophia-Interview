import { ChatMessage, GptFormData } from "../types";
import { FIELD_OPTIONS } from "./handleSendMessage"; // Ensure this path is correct

export function handleTaskOptionSelect({
  msgIndex,
  optionIndex,
  messages,
  setMessages,
  setFormData,
  setTaskInProgress,
  setFieldIndex,
}: {
  msgIndex: number;
  optionIndex: number;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>;
  setTaskInProgress: (taskKey: string) => void;
  setFieldIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const taskOptions = messages[msgIndex].content as { options: string[] };
  const selectedTask = taskOptions.options[optionIndex];

  // Mark selected option in chat history
  setMessages((prev) => {
    const updated = [...prev];
    const msg = updated[msgIndex];
    if (msg.type === "options" && msg.content && "selected" in msg.content) {
      msg.content.selected = optionIndex;
    }
    return [...updated];
  });

  // Ensure the task exists in formData with nulls
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

  // Set task in progress and ask for first field
  setTaskInProgress(selectedTask);
  setFieldIndex(0);

  const options = FIELD_OPTIONS["frequency"];

  setMessages((prev): ChatMessage[] => [
    ...prev,
    {
      type: "text",
      role: "system",
      content: `Perfecto. Empecemos con la tarea "${selectedTask}". ¿Con qué frecuencia la realizas?`,
    },
    ...(options
      ? [
          {
            type: "options" as const,
            role: "assistant" as const,
            content: { options },
          },
        ]
      : []),
  ]);
}
