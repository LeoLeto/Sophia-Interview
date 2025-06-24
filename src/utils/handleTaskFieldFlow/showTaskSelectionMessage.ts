import { ChatMessage } from "../../types";

export function showTaskSelectionMessage({
  title,
  tasks,
  setMessages,
  setIndexChatboxReference,
  setFetchedTasks,
}: {
  title: string;
  tasks: string[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setIndexChatboxReference: React.Dispatch<React.SetStateAction<number>>;
  setFetchedTasks?: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  setMessages((prev) => [
    ...prev,
    {
      type: "text",
      role: "system",
      content: `He seleccionado 5 de las tareas más comunes de un ${title}; escoge la tarea que deseas optimizar o escribe una diferente si no se encuentra entre las opciones`,
    },
    {
      type: "options",
      role: "assistant",
      content: { options: tasks },
      meta: { field: "task" },
    },
  ]);

  setIndexChatboxReference(4);

  if (setFetchedTasks) {
    setFetchedTasks(tasks);
  }
}
