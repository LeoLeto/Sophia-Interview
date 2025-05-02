import { GptFormData } from "../types";

export function isIdentityComplete(formData: GptFormData): boolean {
  return !!formData.name?.trim() && !!formData.position?.trim();
}

export function isTaskFormComplete(formData: GptFormData): boolean {
  return (
    !!formData.frequencyAndTime?.trim() &&
    !!formData.difficulty?.trim() &&
    !!formData.addedValue?.trim() &&
    !!formData.implicitPriority?.trim()
  );
}
