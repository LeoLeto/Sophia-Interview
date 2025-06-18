import { TaskFormData } from "../handleSendMessage/taskTypes";

export function getPromptForField(
  field: keyof TaskFormData,
  task: string
): string {
  switch (field) {
    case "frequency":
      return `¿Con qué frecuencia realizas la tarea "${task}"?`;
    case "duration":
      return `¿Cuánto tiempo tarda en completarse la tarea "${task}"?`;
    case "difficulty":
      return `¿Qué nivel de dificultad tiene la tarea "${task}"?`;
    case "addedValue":
      return `¿Qué valor agregado aporta la tarea "${task}"? Puedes explicarlo con tus propias palabras.`;
    case "implicitPriority":
      return `¿Qué tan prioritaria consideras la tarea "${task}"?`;
    default:
      return `Por favor proporciona información para la tarea "${task}".`;
  }
}
