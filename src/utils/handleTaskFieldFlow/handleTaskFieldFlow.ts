import { ChatMessage, GptFormData } from "../../types";
import { TASK_FIELDS } from "../handleSendMessage/taskTypes";
import { askNextField } from "./askNextField";
import { saveCurrentTaskField } from "./saveCurrentTaskField";
import { sendTaskCompleteOrNext } from "./sendTaskCompleteOrNext";

type HandlerArgs = {
  newMessage: string;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>;
  taskInProgress: string;
  setTaskInProgress: (taskKey: string | null) => void;
  indexCurrentTaskField: number;
  setindexCurrentTaskField: React.Dispatch<React.SetStateAction<number>>;
};

export function handleTaskFieldsFlow({
  newMessage,
  setMessages,
  setFormData,
  taskInProgress,
  setTaskInProgress,
  indexCurrentTaskField,
  setindexCurrentTaskField,
}: HandlerArgs) {
  const currentField = TASK_FIELDS[indexCurrentTaskField];
  console.log(`[handleTaskFieldsFlow] Saving ${currentField} = ${newMessage}`);

  // Save current field value
  saveCurrentTaskField({
    taskKey: taskInProgress,
    fieldKey: currentField,
    selectedValue: parseInt(newMessage),
    setFormData,
  });

  const hasMoreFields = indexCurrentTaskField < TASK_FIELDS.length - 1;
  const nextField = TASK_FIELDS[indexCurrentTaskField + 1];

  // Skip 'addedValue' for now if it's next
  const isNextFieldSkippable = nextField === "addedValue";

  if (hasMoreFields && !isNextFieldSkippable) {
    setindexCurrentTaskField(indexCurrentTaskField + 1);

    askNextField({
      fieldKey: nextField,
      taskKey: taskInProgress,
      setMessages,
    });
  } else {
    setindexCurrentTaskField(0);
    sendTaskCompleteOrNext({
      taskKey: taskInProgress,
      indexCurrentTaskField,
      setindexCurrentTaskField,
      setTaskInProgress,
      setMessages,
    });
  }
}
