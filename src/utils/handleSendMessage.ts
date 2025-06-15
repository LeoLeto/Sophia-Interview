import { ChatMessage, GptFormData } from "../types";
import { fetchBotResponse } from "./fetchBotResponse";

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
) => {
  const userMsg: ChatMessage = {
    type: "text",
    role: "user",
    content: newMessage,
  };

  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  try {
    // USER INPUTS NAME
    if (indexChatProgress == 1) {
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
      // 🟢 TODO: ADD HERE OPENAI ASSISTANT TO GET ROLE-RELATED TASKS
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          role: "system",
          content:
            "He seleccionado 5 de las tareas más comunes de un vendedor; escoge la tarea que deseas optimizar o escribe una diferente si no se encuentra entre las opciones",
        },
        {
          role: "assistant",
          type: "options",
          content: {
            options: [
              "Option 1",
              "Option 2",
              "Option 3",
              "Option 4",
              "Option 5",
            ],
          },
        },
      ]);

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

      // ONLY UPDATES NAME AND POSITION IF THEY HAVE VALID VALUES
      const keepIfValid = <T>(incoming: T | undefined | null, existing: T): T =>
        typeof incoming === "string" && incoming.trim() !== ""
          ? incoming
          : existing;

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
