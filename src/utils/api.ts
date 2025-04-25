import { Message } from "../types";

export const fetchBotResponse = async (
  messages: Message[]
): Promise<string> => {
  const payload = {
    messages: messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })),
  };

  const res = await fetch(import.meta.env.VITE_CHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.message) {
    throw new Error("Error fetching response");
  }

  return data.message;
};
