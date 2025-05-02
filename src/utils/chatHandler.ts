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

  // Add user message to the message state
  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  try {
    const { message, audioUrl, formDataUpdate, updatedMessages } =
      await fetchBotResponse(
        [...currentMessages, userMsg],
        isSpeechEnabled,
        formData,
        taskInProgress
      );

    console.log(" updatedMessages: ", updatedMessages);

    // Initialize the messages array that will be updated
    let newBotMessages: Message[] = [];

    // If there are updatedMessages, filter and map them to the expected format
    if (updatedMessages?.length) {
      newBotMessages = updatedMessages
        .filter(
          (msg) =>
            msg.role === "assistant" &&
            typeof msg.content === "string" &&
            msg.content.trim().length > 0
        )
        .map((msg) => ({
          sender: "bot",
          text: msg.content!,
        }));
    }

    // If no updatedMessages, fallback to just the message from the API
    if (!newBotMessages.length && message?.trim()) {
      newBotMessages.push({ sender: "bot", text: message });
    }

    // Check for duplicates before appending
    const newMessages = newBotMessages.filter(
      (msg) =>
        !currentMessages.some(
          (m) => m.text === msg.text && m.sender === msg.sender
        )
    );

    // Add the new bot messages to the state only if they are not duplicates
    if (newMessages.length) {
      setMessages((prev) => [...prev, ...newMessages]);
    }

    // Apply updates to formData if any
    if (formDataUpdate) {
      setFormData((prev) => ({ ...prev, ...formDataUpdate }));
    }

    // Only speak the response if speech is enabled and audioUrl is present
    if (isSpeechEnabled && audioUrl) {
      console.log("THIS RUNS");
      const audio = new Audio(audioUrl);
      audio.play();
    }
  } catch (error) {
    console.log(" error: ", error);
    const errorMsg: Message = {
      sender: "bot",
      text: "Lo siento, ocurrió un error al responder.",
    };
    setMessages((prev) => [...prev, errorMsg]);
  } finally {
    setLoading(false);
  }
};
