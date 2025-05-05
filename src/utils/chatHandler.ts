import { GptFormData, ChatMessage } from "../types";
import { fetchBotResponse } from "../utils/api";

export const handleSendMessage = async (
  newMessage: string,
  currentMessages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isSpeechEnabled: boolean,
  formData: GptFormData,
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>,
  taskInProgress: string
) => {
  const userMsg: ChatMessage = { role: "user", content: newMessage };

  // Add user message to the message state
  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  try {
    const { message, audioUrl, formDataUpdate, messageHistory } =
      await fetchBotResponse(
        [...currentMessages, userMsg],
        isSpeechEnabled,
        formData,
        taskInProgress
      );

    console.log(" message: ", message);
    // console.log(" messageHistory: ", messageHistory);

    // Initialize the messages array that will be updated
    let newBotMessages: ChatMessage[] = [];

    // If there is messageHistory, filter and map them to the expected format
    if (messageHistory?.length) {
      newBotMessages = messageHistory
        .filter(
          (msg) =>
            msg.role === "assistant" &&
            typeof msg.content === "string" &&
            msg.content.trim().length > 0
        )
        .map((msg) => ({
          role: "assistant",
          content: msg.content!,
        }));
      console.log(" newBotMessages: ", newBotMessages);
    }

    // Check for duplicates before appending
    const filteredNewMessages = newBotMessages.filter(
      (msg) =>
        !currentMessages.some(
          (m) => m.content === msg.content && m.role === msg.role
        )
    );

    // Add the new bot messages to the state only if they are not duplicates
    if (filteredNewMessages.length) {
      setMessages((prev) => [...prev, ...filteredNewMessages]);
    }

    // Apply updates to formData if any
    if (formDataUpdate) {
      setFormData((prev) => ({ ...prev, ...formDataUpdate }));
    }

    // Only speak the response if speech is enabled and audioUrl is present
    if (isSpeechEnabled && audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  } catch (error) {
    console.log(" error: ", error);
    const errorMsg: ChatMessage = {
      role: "assistant",
      content: "Lo siento, ocurrió un error al responder.",
    };
    setMessages((prev) => [...prev, errorMsg]);
  } finally {
    setLoading(false);
  }
};
