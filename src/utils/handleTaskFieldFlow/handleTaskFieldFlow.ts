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
  formData: GptFormData;
  // setTaskInProgressFromUserSelection: (options: string[]) => void;
  fetchedTasks: string[];
  setIndexChatboxReference: React.Dispatch<React.SetStateAction<number>>;
};

export function handleTaskFieldsFlow({
  newMessage,
  setMessages,
  setFormData,
  taskInProgress,
  setTaskInProgress,
  indexCurrentTaskField,
  setindexCurrentTaskField,
  formData,
  // setTaskInProgressFromUserSelection,
  fetchedTasks,
  setIndexChatboxReference,
}: HandlerArgs) {
  const currentField = TASK_FIELDS[indexCurrentTaskField];
  console.log(`[handleTaskFieldsFlow] Saving ${currentField} = ${newMessage}`);

  // Save the current field value
  saveCurrentTaskField({
    taskKey: taskInProgress,
    fieldKey: currentField,
    selectedValue: newMessage,
    setFormData,
  });

  const currentIndex = TASK_FIELDS.indexOf(currentField);
  const hasMoreFields = currentIndex < TASK_FIELDS.length - 1;

  if (hasMoreFields) {
    const nextIndex = currentIndex + 1;
    const nextField = TASK_FIELDS[nextIndex];

    setindexCurrentTaskField(nextIndex);

    askNextField({
      taskKey: taskInProgress,
      fieldKey: nextField,
      setMessages,
      setIndexChatboxReference,
    });
  } else {
    // All fields done: reset index and proceed
    setindexCurrentTaskField(0);

    sendTaskCompleteOrNext({
      taskKey: taskInProgress,
      fieldKey: currentField,
      setindexCurrentTaskField,
      setTaskInProgress,
      setMessages,
      getFormData: () => formData,
      // setTaskInProgressFromUserSelection,
      fetchedTasks,
      setIndexChatboxReference,
    });
  }
}
