import { GptFormData, Message } from "../types";

export const fetchBotResponse = async (
  messages: Message[],
  isSpeechEnabled: boolean, // Add isSpeechEnabled as an argument
  formData: GptFormData,
  taskInProgress: string
): Promise<{
  message: string;
  audioUrl: string | null;
  formDataUpdate: Partial<GptFormData> | null;
  updatedMessages?: { role: string; content?: string }[] | null;
}> => {
  const payload = {
    messages: messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })),
    isSpeechEnabled,
    formData,
    taskInProgress,
  };

  const res = await fetch(import.meta.env.VITE_API_URL + "IOGpt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  console.log(" data: ", data);

  if (!res.ok || !data.message) {
    throw new Error("Error fetching response");
  }

  return {
    message: data.message,
    audioUrl: data.audioUrl || null, // If no audioUrl, return null
    formDataUpdate: data.formDataUpdate || null,
    updatedMessages: data.updatedMessages,
  };
};
