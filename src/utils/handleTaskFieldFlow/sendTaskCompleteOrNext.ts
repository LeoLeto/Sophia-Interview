import { TASK_FIELDS } from "../handleSendMessage/taskTypes";
import { askNextField } from "./askNextField";
import { ChatMessage, TaskFormData } from "../../types";

type Args = {
  taskKey: string;
  fieldKey: keyof TaskFormData;
  setindexCurrentTaskField: React.Dispatch<React.SetStateAction<number>>;
  setTaskInProgress: (taskKey: string | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};

export function sendTaskCompleteOrNext({
  taskKey,
  fieldKey,
  setindexCurrentTaskField,
  setTaskInProgress,
  setMessages,
}: Args) {
  const currentIndex = TASK_FIELDS.indexOf(fieldKey);
//   console.log("[sendTaskCompleteOrNext] current field:", fieldKey);
//   console.log("[sendTaskCompleteOrNext] current index:", currentIndex);

  const hasMore = currentIndex < TASK_FIELDS.length - 1;
  const nextField = TASK_FIELDS[currentIndex + 1];
//   console.log("[sendTaskCompleteOrNext] hasMore:", hasMore);
//   console.log("[sendTaskCompleteOrNext] nextField:", nextField);

  if (hasMore && nextField !== "addedValue") {
    // console.log("[sendTaskCompleteOrNext] Proceeding to ask next field");
    askNextField({
      taskKey,
      fieldKey: nextField,
      setMessages,
    });

    setindexCurrentTaskField(currentIndex + 1);
  } else {
    // console.log(
    //   "[sendTaskCompleteOrNext] No more fields or skipping addedValue"
    // );
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
