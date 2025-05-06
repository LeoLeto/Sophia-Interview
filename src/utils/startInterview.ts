import { fetchBotResponse } from "./fetchBotResponse";
import { GptFormData, ChatMessage } from "../types";

export const startInterview = async (
  isSpeechEnabled: boolean,
  formData: GptFormData
): Promise<{
  message: string;
  formDataUpdate: Partial<GptFormData> | null;
  messageHistory?: { role: string; content?: string }[] | null;
}> => {
  const initialMessage: ChatMessage = {
    role: "user",
    content: "Hola",
  };

  try {
    const {
      message: botMessage,
      formDataUpdate,
      messageHistory,
    } = await fetchBotResponse([initialMessage], isSpeechEnabled, formData);

    return {
      message: botMessage,
      formDataUpdate,
      messageHistory,
    };
  } catch (error) {
    console.error("Error starting interview:", error);
    return {
      message: "Lo siento, ocurrió un error al iniciar la entrevista.",
      formDataUpdate: null,
      messageHistory: null,
    };
  }
};
