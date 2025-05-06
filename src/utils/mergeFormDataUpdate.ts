import { GptFormData } from "../types";

export function mergeFormDataUpdate(
  prev: GptFormData,
  updates: Partial<Pick<GptFormData, "tasks">>
): GptFormData {
  return {
    ...prev,
    tasks: {
      ...prev.tasks,
      ...updates.tasks,
    },
  };
}
