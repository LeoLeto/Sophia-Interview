import { GptFormData } from "../types";

export function isFormDataComplete(formData: GptFormData): boolean {
  return Object.values(formData).every((val) => val && val.trim() !== "");
}
