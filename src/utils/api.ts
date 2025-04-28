import { Message } from "../types";

export const fetchBotResponse = async (
  messages: Message[],
  isSpeechEnabled: boolean // Add isSpeechEnabled as an argument
): Promise<{ message: string; audioUrl: string | null }> => {
  const payload = {
    messages: messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })),
    isSpeechEnabled, // Send isSpeechEnabled to the API
  };

  const res = await fetch(import.meta.env.VITE_API_URL + "Gpt4", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.message) {
    throw new Error("Error fetching response");
  }

  return {
    message: data.message,
    audioUrl: data.audioUrl || null, // If no audioUrl, return null
  };
};
