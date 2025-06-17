import { GptFormData } from "../types";

export function isTaskFormComplete(
  formData: GptFormData,
  taskName: string
): boolean {
  const currentTask = formData.tasks?.[taskName];
  if (!currentTask) return false;

  const { frequency, duration, difficulty, addedValue, implicitPriority } =
    currentTask;

  return (
    !!frequency &&
    !!duration &&
    !!difficulty &&
    !!addedValue &&
    !!implicitPriority
  );
}

export function isIdentityComplete(formData: GptFormData): boolean {
  return !!formData.name && !!formData.position;
}
