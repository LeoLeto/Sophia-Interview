import { ChatMessage, GptFormData } from "../types";
import { fetchBotResponse } from "./fetchBotResponse";
import { fetchTaskFinder } from "./fetchTasks";

export const handleSendMessage = async (
  newMessage: string,
  currentMessages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isSpeechEnabled: boolean,
  formData: GptFormData,
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>,
  taskInProgress: keyof GptFormData["tasks"],
  setTaskInProgress: (taskKey: string) => void,
  sessionId: string,
  userId: string,
  indexChatProgress: number,
  setIndexChatProgress: React.Dispatch<React.SetStateAction<number>>
  // setJobTasks: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const userMsg: ChatMessage = {
    type: "text",
    role: "user",
    content: newMessage,
  };

  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  // ONLY UPDATES NAME AND POSITION IF THEY HAVE VALID VALUES
  const keepIfValid = <T>(incoming: T | undefined | null, existing: T): T =>
    typeof incoming === "string" && incoming.trim() !== ""
      ? incoming
      : existing;

  try {
    // USER INPUTS NAME
    if (indexChatProgress == 1) {
      setFormData((prev) => ({
        ...prev,
        name: keepIfValid(newMessage, prev.name),
      }));

      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          role: "system",
          content: "Y ahora, ¿podrías decirme tu cargo en la empresa?",
        },
      ]);

      setIndexChatProgress(2);

      return;
    }
    // USER INPUTS COMPANY POSITION
    if (indexChatProgress == 2) {
      setFormData((prev) => ({
        ...prev,
        position: keepIfValid(newMessage, prev.position),
      }));

      try {
        const result = await fetchTaskFinder(newMessage);
        if (result.found) {
          console.log("Tasks:", result.tasks);
          // setJobTasks(result.tasks);
          setMessages((prev) => [
            ...prev,
            {
              type: "text",
              role: "system",
              content: `He seleccionado 5 de las tareas más comunes de un ${newMessage}; escoge la tarea que deseas optimizar o escribe una diferente si no se encuentra entre las opciones`,
            },
            {
              role: "assistant",
              type: "options",
              content: {
                options: result.tasks,
              },
            },
          ]);
        } else {
          console.warn("Not found:", result.reason);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Request failed:", err.message);
        } else {
          console.error("Request failed:", err);
        }
      }

      setIndexChatProgress(3);

      return;
    }

    const { audioUrl, formDataUpdate, messageHistory } = await fetchBotResponse(
      [...currentMessages, userMsg],
      isSpeechEnabled,
      formData,
      taskInProgress,
      userId,
      sessionId
    );

    // Process assistant messages from history
    const newBotMessages: ChatMessage[] = (messageHistory || [])
      .filter(
        (msg): msg is ChatMessage & { type: "text"; content: string } =>
          msg.role === "assistant" &&
          msg.type === "text" &&
          typeof msg.content === "string" &&
          msg.content.trim().length > 0
      )
      .map((msg) => ({
        type: "text",
        role: "assistant",
        content: msg.content,
      }));

    const filteredNewMessages = newBotMessages.filter(
      (msg) =>
        !currentMessages.some(
          (m) => m.content === msg.content && m.role === msg.role
        )
    );

    if (filteredNewMessages.length) {
      setMessages((prev) => [...prev, ...filteredNewMessages]);
    }

    // Apply formData updates if valid
    if (formDataUpdate) {
      const cleanedTasks =
        formDataUpdate.tasks && typeof formDataUpdate.tasks === "object"
          ? Object.fromEntries(
              Object.entries(formDataUpdate.tasks).filter(
                ([key, task]) => key && task && typeof task === "object"
              )
            )
          : {};

      setFormData((prev) => ({
        ...prev,
        name: keepIfValid(formDataUpdate.name, prev.name),
        position: keepIfValid(formDataUpdate.position, prev.position),
        tasks: {
          ...prev.tasks,
          ...cleanedTasks,
        },
      }));

      const taskKeys = Object.keys(cleanedTasks);
      if (taskKeys.length > 0) {
        setTaskInProgress(taskKeys[0]);
      }
    }

    // Optional speech playback
    if (isSpeechEnabled && audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  } catch (error) {
    console.error("error in handleSendMessage:", error);
    const errorMsg: ChatMessage = {
      type: "text",
      role: "assistant",
      content: "Lo siento, ocurrió un error al responder.",
    };
    setMessages((prev) => [...prev, errorMsg]);
  } finally {
    setLoading(false);
  }
};
