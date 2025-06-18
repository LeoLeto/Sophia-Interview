import { GptFormData } from "../../types";

type TaskFieldKey = keyof GptFormData["tasks"][string];

type Args = {
  taskKey: string;
  fieldKey: TaskFieldKey;
  selectedValue: string | number;
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>;
};

export function saveCurrentTaskField({
  taskKey,
  fieldKey,
  selectedValue,
  setFormData,
}: Args) {
  setFormData((prev) => {
    const updatedTasks = { ...prev.tasks };

    if (!updatedTasks[taskKey]) {
      updatedTasks[taskKey] = {
        frequency: null,
        duration: null,
        difficulty: null,
        addedValue: null,
        implicitPriority: null,
      };
    }

    // Decide how to store based on fieldKey
    let valueToStore: string | number | null;

    if (fieldKey === "addedValue") {
      // For addedValue, keep as string (selectedValue is string)
      valueToStore = String(selectedValue);
    } else {
      // For other fields, store as number or null
      if (
        selectedValue === "" ||
        selectedValue === null ||
        selectedValue === undefined
      ) {
        valueToStore = null;
      } else if (typeof selectedValue === "string") {
        valueToStore = parseInt(selectedValue, 10);
      } else {
        valueToStore = selectedValue;
      }
    }

    updatedTasks[taskKey] = {
      ...updatedTasks[taskKey],
      [fieldKey]: valueToStore,
    };

    return {
      ...prev,
      tasks: updatedTasks,
    };
  });
}
