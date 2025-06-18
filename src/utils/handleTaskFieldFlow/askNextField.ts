import { ChatMessage, TaskFormData } from "../../types";
import { FIELD_OPTIONS } from "../handleSendMessage/taskTypes";

export function askNextField({
  fieldKey,
  taskKey,
  setMessages,
}: {
  fieldKey: keyof TaskFormData;
  taskKey: string;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}) {
  const options = FIELD_OPTIONS[fieldKey];

  if (!options) return;

  setMessages((prev) => [
    ...prev,
    {
      type: "text",
      role: "system",
      content: getPromptForField(fieldKey, taskKey),
    },
    {
      type: "options",
      role: "assistant",
      content: { options },
      meta: { field: fieldKey },
    },
  ]);
}

function getPromptForField(field: keyof TaskFormData, task: string): string {
  switch (field) {
    case "frequency":
      return `¿Con qué frecuencia realizas la tarea "${task}"?`;
    case "duration":
      return `¿Cuánto tiempo tarda la tarea "${task}"?`;
    case "difficulty":
      return `¿Qué dificultad tiene la tarea "${task}"?`;
    case "implicitPriority":
      return `¿Cuál es la prioridad de la tarea "${task}"?`;
    default:
      return `Por favor proporciona información para la tarea "${task}".`;
  }
}
