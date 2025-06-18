import { ChatMessage, GptFormData } from "../../types";
import { TASK_FIELDS, TaskFormData } from "../handleSendMessage/taskTypes";
import { askNextField } from "./askNextField";
import { getNextIncompleteTask } from "./getNextIncompleteTask";

type Args = {
  taskKey: string;
  fieldKey: keyof TaskFormData;
  setindexCurrentTaskField: React.Dispatch<React.SetStateAction<number>>;
  setTaskInProgress: (taskKey: string | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  formData: GptFormData;
  setTaskInProgressFromUserSelection: (options: string[]) => void;
};

export function sendTaskCompleteOrNext({
  taskKey,
  fieldKey,
  setindexCurrentTaskField,
  setTaskInProgress,
  setMessages,
  formData,
  setTaskInProgressFromUserSelection,
}: Args) {
  const currentIndex = TASK_FIELDS.indexOf(fieldKey);
  const hasMore = currentIndex < TASK_FIELDS.length - 1;

  if (hasMore) {
    const nextField = TASK_FIELDS[currentIndex + 1];

    // Only continue if the next field is not already completed
    if (formData.tasks[taskKey]?.[nextField] == null) {
      askNextField({
        taskKey,
        fieldKey: nextField,
        setMessages,
      });
      setindexCurrentTaskField(currentIndex + 1);
      return;
    }
  }

  // All fields completed or next field already filled
  setMessages((prev) => [
    ...prev,
    {
      type: "text",
      role: "assistant",
      content: `¡Perfecto! Hemos completado la tarea "${taskKey}".`,
    },
  ]);
  setTaskInProgress(null);
  setindexCurrentTaskField(0);

  const nextTaskKey = getNextIncompleteTask(formData.tasks);

  if (nextTaskKey) {
    const remainingTaskNames = Object.entries(formData.tasks)
      .filter(([, task]) => TASK_FIELDS.some((f) => task[f] == null))
      .map(([taskName]) => taskName);

    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        role: "assistant",
        content:
          "¿Cuál de las siguientes tareas quieres completar a continuación?",
      },
      {
        type: "options",
        role: "assistant",
        content: {
          options: remainingTaskNames,
        },
        meta: {
          field: "taskSelection",
        },
      },
    ]);

    setTaskInProgressFromUserSelection(remainingTaskNames);
  }
}
