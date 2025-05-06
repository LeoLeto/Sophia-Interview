import { GptFormData, ChatMessage } from "../types";
import { fetchBotResponse } from "./fetchBotResponse";
import { mergeFormDataUpdate } from "./mergeFormDataUpdate";

export const handleSendMessage = async (
  newMessage: string,
  currentMessages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isSpeechEnabled: boolean,
  formData: GptFormData,
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>,
  taskInProgress: keyof GptFormData["tasks"],
  setTaskInProgress: (taskKey: string) => void
) => {
  const userMsg: ChatMessage = { role: "user", content: newMessage };

  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  try {
    const { audioUrl, formDataUpdate, identityUpdate, messageHistory } =
      await fetchBotResponse(
        [...currentMessages, userMsg],
        isSpeechEnabled,
        formData,
        taskInProgress
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

    // Apply task-specific update (and track current task)
    if (formDataUpdate) {
      if (formDataUpdate.tasks) {
        const taskKeys = Object.keys(formDataUpdate.tasks);
        if (taskKeys.length > 0) {
          setTaskInProgress(taskKeys[0]);
        }
      }

      setFormData((prev) => mergeFormDataUpdate(prev, formDataUpdate));
    }

    // Apply identity update (name/position)
    if (identityUpdate) {
      setFormData((prev) => ({
        ...prev,
        name: identityUpdate.name ?? prev.name,
        position: identityUpdate.position ?? prev.position,
      }));
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
