import { ChatMessage, TaskFormData } from "../../types";
import { FIELD_OPTIONS } from "../handleSendMessage/taskTypes";

export function askNextField(
  field: keyof TaskFormData,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  const options = FIELD_OPTIONS[field];

  setMessages((prev) => [
    ...prev,
    {
      type: "text",
      role: "system",
      content: `¿Cuál es la ${field} de esta tarea?`,
    },
    ...(options
      ? [
          {
            type: "options",
            role: "assistant",
            content: { options },
          } as const,
        ]
      : []),
  ]);
}
