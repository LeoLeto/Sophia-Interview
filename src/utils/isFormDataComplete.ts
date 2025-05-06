import { GptFormData } from "../types";

export function isTaskFormComplete(
  formData: GptFormData,
  taskName: string
): boolean {
  const currentTask = formData.tasks?.[taskName];
  if (!currentTask) return false;

  const { frequencyAndTime, difficulty, addedValue, implicitPriority } =
    currentTask;

  return (
    !!frequencyAndTime && !!difficulty && !!addedValue && !!implicitPriority
  );
}

export function isIdentityComplete(formData: GptFormData): boolean {
  return !!formData.name && !!formData.position;
}
