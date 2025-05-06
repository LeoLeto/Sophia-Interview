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
    const {
      message,
      audioUrl,
      formDataUpdate,
      identityUpdate,
      messageHistory,
    } = await fetchBotResponse(
      [...currentMessages, userMsg],
      isSpeechEnabled,
      formData,
      taskInProgress
    );

    console.log(" message: ", message);

    // Process any assistant message history
    let newBotMessages: ChatMessage[] = [];
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
    }

    const filteredNewMessages = newBotMessages.filter(
      (msg) =>
        !currentMessages.some(
          (m) => m.content === msg.content && m.role === msg.role
        )
    );

    if (filteredNewMessages.length) {
      setMessages((prev) => [...prev, ...filteredNewMessages]);
    }

    // Apply name/position updates
    if (identityUpdate) {
      setFormData((prev) => ({
        ...prev,
        name: identityUpdate.name ?? prev.name,
        position: identityUpdate.position ?? prev.position,
      }));
    }

    // Apply task-specific update
    if (formDataUpdate) {
      setFormData((prev) => ({
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskInProgress]: {
            ...prev.tasks[taskInProgress],
            ...formDataUpdate,
          },
        },
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
