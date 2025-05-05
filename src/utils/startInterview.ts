import { fetchBotResponse } from "./api";
import { GptFormData, Message } from "../types";

export const startInterview = async (
  isSpeechEnabled: boolean,
  formData: GptFormData,
  taskInProgress: string
): Promise<{
  message: string;
  formDataUpdate: Partial<GptFormData> | null;
  updatedMessages?: { role: string; content?: string }[] | null;
}> => {
  const initialMessage: Message = {
    sender: "user",
    text: "Hola",
  };

  try {
    const {
      message: botMessage,
      formDataUpdate,
      updatedMessages,
    } = await fetchBotResponse(
      [initialMessage],
      isSpeechEnabled,
      formData,
      taskInProgress
    );

    return {
      message: botMessage,
      formDataUpdate,
      updatedMessages,
    };
  } catch (error) {
    console.error("Error starting interview:", error);
    return {
      message: "Lo siento, ocurrió un error al iniciar la entrevista.",
      formDataUpdate: null,
      updatedMessages: null,
    };
  }
};
