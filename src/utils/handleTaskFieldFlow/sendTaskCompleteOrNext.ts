import { ChatMessage, GptFormData } from "../../types";
import { FIELD_OPTIONS, TASK_FIELDS } from "../handleSendMessage/taskTypes";
import { getNextIncompleteTask } from "./getNextIncompleteTask";

export function sendTaskCompleteOrNext(
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setTaskInProgress: (taskKey: string | null) => void,
  setindexCurrentTaskField: React.Dispatch<React.SetStateAction<number>>
) {
  setFormData((prev) => {
    const nextTask = getNextIncompleteTask(prev.tasks);

    if (nextTask) {
      setTaskInProgress(nextTask);
      setindexCurrentTaskField(0);
      const firstField = TASK_FIELDS[0];

      setMessages((prevMsgs) => [
        ...prevMsgs,
        {
          type: "text",
          role: "system",
          content: `Vamos a continuar con la siguiente tarea: ${nextTask}. ¿Cuál es su ${firstField}?`,
        },
        ...(FIELD_OPTIONS[firstField]
          ? [
              {
                type: "options",
                role: "assistant",
                content: { options: FIELD_OPTIONS[firstField]! },
              } as const,
            ]
          : []),
      ]);
    } else {
      setTaskInProgress(null);
      setMessages((prevMsgs) => [
        ...prevMsgs,
        {
          type: "text",
          role: "system",
          content: "Gracias. Has completado todas las tareas.",
        },
      ]);
    }

    return prev;
  });
}
