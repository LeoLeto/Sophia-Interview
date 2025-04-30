import { GptFormData, Message } from "../types";
import { fetchBotResponse } from "../utils/api";

export const handleSendMessage = async (
  newMessage: string,
  currentMessages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isSpeechEnabled: boolean,
  formData: GptFormData,
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>,
  taskInProgress: string
) => {
  const userMsg: Message = { sender: "user", text: newMessage };

  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  try {
    const { message, audioUrl, formDataUpdate } = await fetchBotResponse(
      [...currentMessages, userMsg],
      isSpeechEnabled,
      formData,
      taskInProgress
    );

    const botMsg: Message = { sender: "bot", text: message };
    setMessages((prev) => [...prev, botMsg]);

    // Apply updates to formData
    if (formDataUpdate) {
      setFormData((prev) => ({ ...prev, ...formDataUpdate }));
    }

    // Only speak the response if speech is enabled and audioUrl is present
    if (isSpeechEnabled && audioUrl) {
      console.log("THIS RUNS");
      const audio = new Audio(audioUrl);
      audio.play();
    }
  } catch {
    const errorMsg: Message = {
      sender: "bot",
      text: "Lo siento, ocurrió un error al responder.",
    };
    setMessages((prev) => [...prev, errorMsg]);
  } finally {
    setLoading(false);
  }
};
