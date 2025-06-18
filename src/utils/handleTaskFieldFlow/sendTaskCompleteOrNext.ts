import { TASK_FIELDS } from "../handleSendMessage/taskTypes";
import { askNextField } from "./askNextField";
import { ChatMessage } from "../../types";

type Args = {
  taskKey: string;
  indexCurrentTaskField: number;
  setindexCurrentTaskField: React.Dispatch<React.SetStateAction<number>>;
  setTaskInProgress: (taskKey: string | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};

export function sendTaskCompleteOrNext({
  taskKey,
  indexCurrentTaskField,
  setindexCurrentTaskField,
  setTaskInProgress,
  setMessages,
}: Args) {
  if (indexCurrentTaskField < TASK_FIELDS.length - 1) {
    const nextIndex = indexCurrentTaskField + 1;
    const nextField = TASK_FIELDS[nextIndex];

    askNextField({
      taskKey,
      fieldKey: nextField,
      setMessages,
    });

    setindexCurrentTaskField(nextIndex);
  } else {
    // ✅ All fields complete — mark task as done
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        role: "system",
        content: `¡Perfecto! Hemos completado la tarea "${taskKey}".`,
      },
    ]);
    setTaskInProgress(null);
    setindexCurrentTaskField(0);
  }
}
