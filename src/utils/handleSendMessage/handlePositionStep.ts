import { ChatMessage, GptFormData } from "../../types";
import { fetchTaskFinder } from "../fetchTasks";

export async function handlePositionStep(
  newMessage: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>,
  setIndexChatboxReference: React.Dispatch<React.SetStateAction<number>>,
  setFetchedTasks: React.Dispatch<React.SetStateAction<string[]>>,
  // setIsChatboxEnabled: React.Dispatch<React.SetStateAction<boolean>>
  // setPendingOccupationMatch?: React.Dispatch<
  // React.SetStateAction<{
  //   label: string;
  //   allLabels: string[];
  //   originals: string[];
  // } | null>
  // >, // <-- Add this to manage disambiguation state if needed
) {
  const jobTitle = newMessage.trim();

  setFormData((prev) => ({
    ...prev,
    position: jobTitle || prev.position,
  }));

  try {
    const result = await fetchTaskFinder(jobTitle);
    console.log("fetchTaskFinder result: ", result);

    if (result.found) {
      setFetchedTasks(result.tasks);

      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          role: "system",
          content: `He seleccionado 5 de las tareas más comunes de un ${jobTitle}; escoge la tarea que deseas optimizar o escribe una diferente si no se encuentra entre las opciones`,
        },
        {
          type: "options",
          role: "assistant",
          content: { options: result.tasks },
          meta: { field: "task" },
        },
      ]);

      setIndexChatboxReference(4);
      return;
    }

    // Handle disambiguation
    if ("multiple" in result && result.multiple) {
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          role: "system",
          content: result.message,
        },
        {
          type: "options",
          role: "assistant",
          content: {
            options: result.options,
          },
          meta: {
            field: "occupationMatch",
            originals: result.originalOptions,
          },
        },
      ]);

      // Optional: store disambiguation context
      // setPendingOccupationMatch?.({
      //   label: jobTitle,
      //   allLabels: result.options,
      //   originals: result.originalOptions,
      // });

      setIndexChatboxReference(3);
      // console.log("DISABLING CHATBOX");
      // setIsChatboxEnabled(false);

      return;
    }

    // Fallback for generic failure
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        role: "system",
        content:
          result.reason || "No se pudieron encontrar tareas para ese cargo.",
      },
    ]);
  } catch (err) {
    console.error("fetchTaskFinder failed:", err);
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        role: "system",
        content: "Ocurrió un error al buscar las tareas. Intenta nuevamente.",
      },
    ]);
  }

  setIndexChatboxReference(3);
}
