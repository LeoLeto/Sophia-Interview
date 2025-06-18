import { ChatMessage, GptFormData } from "../../types";
import { fetchTaskFinder } from "../fetchTasks";

export async function handlePositionStep(
  newMessage: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>,
  setindexIdentityStep: React.Dispatch<React.SetStateAction<number>>
) {
  setFormData((prev) => ({
    ...prev,
    position: newMessage.trim() || prev.position,
  }));

  try {
    const result = await fetchTaskFinder(newMessage);

    if (result.found) {
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          role: "system",
          content: `He seleccionado 5 de las tareas más comunes de un ${newMessage}; escoge la tarea que deseas optimizar o escribe una diferente si no se encuentra entre las opciones`,
        },
        {
          type: "options",
          role: "assistant",
          content: { options: result.tasks },
          meta: { field: "task" },
        },
      ]);
    }
  } catch (err) {
    console.error("fetchTaskFinder failed:", err);
  }

  setindexIdentityStep(3);
}
