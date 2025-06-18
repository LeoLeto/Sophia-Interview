import { GptFormData, TaskFormData } from "../../types";

export function saveCurrentTaskField(
  taskKey: string,
  field: keyof TaskFormData,
  value: string,
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>
) {
  setFormData((prev) => {
    const updatedTask = {
      ...prev.tasks[taskKey],
      [field]: value,
    };
    return {
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskKey]: updatedTask,
      },
    };
  });
}
