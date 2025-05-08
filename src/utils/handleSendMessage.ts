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
  userId: string
) => {
  const userMsg: ChatMessage = { role: "user", content: newMessage };

  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  try {
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
        (msg) =>
          msg.role === "assistant" &&
          typeof msg.content === "string" &&
          msg.content.trim().length > 0
      )
      .map((msg) => ({ role: "assistant", content: msg.content! }));

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
      role: "assistant",
      content: "Lo siento, ocurrió un error al responder.",
    };
    setMessages((prev) => [...prev, errorMsg]);
  } finally {
    setLoading(false);
  }
};
