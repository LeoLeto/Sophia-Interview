import { GptFormData } from "../../types";

export function saveCurrentTaskField({
  taskKey,
  fieldKey,
  selectedValue,
  setFormData,
}: {
  taskKey: string;
  fieldKey: keyof GptFormData["tasks"][string];
  selectedValue: number;
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>;
}) {
  setFormData((prev) => ({
    ...prev,
    tasks: {
      ...prev.tasks,
      [taskKey]: {
        ...prev.tasks[taskKey],
        [fieldKey]: selectedValue,
      },
    },
  }));
}
