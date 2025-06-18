// src/utils/messageBuilders.ts
import { ChatMessage } from "../../types";
import { FIELD_OPTIONS, TaskFormData } from "./taskTypes";

export function insertTaskFieldPrompt(
  field: keyof TaskFormData,
  taskName: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  const options = FIELD_OPTIONS[field];

  setMessages((prevMsgs) => [
    ...prevMsgs,
    {
      type: "text",
      role: "system",
      content: `¿Cuál es la ${field} de la tarea: ${taskName}?`,
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
