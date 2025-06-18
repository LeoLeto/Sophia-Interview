import { GptFormData, TaskFormData } from "../../types";

type Args = {
  taskKey: string;
  fieldKey: keyof TaskFormData;
  selectedValue: number; // option index
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>;
};

export function saveCurrentTaskField({
  taskKey,
  fieldKey,
  selectedValue,
  setFormData,
}: Args) {
  console.log(
    `[saveCurrentTaskField] Saving ${fieldKey} = ${selectedValue} for ${taskKey}`
  );

  setFormData((prev) => {
    const prevTask = prev.tasks[taskKey] ?? {};
    const updatedTask = {
      ...prevTask,
      [fieldKey]: selectedValue,
    };
    const updated = {
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskKey]: updatedTask,
      },
    };
    console.log("[saveCurrentTaskField] Updated formData:", updated);
    return updated;
  });
}
