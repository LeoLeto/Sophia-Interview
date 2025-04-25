import { Message } from "../types"; // or wherever your Message type lives
import { fetchBotResponse } from "../utils/api";

export const handleSendMessage = async (
  newMessage: string,
  currentMessages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const userMsg: Message = { sender: "user", text: newMessage };

  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  try {
    const responseText = await fetchBotResponse([...currentMessages, userMsg]);

    const botMsg: Message = { sender: "bot", text: responseText };
    setMessages((prev) => [...prev, botMsg]);
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
