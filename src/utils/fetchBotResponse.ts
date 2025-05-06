import { ChatMessage, GptFormData } from "../types";

export const fetchBotResponse = async (
  messages: ChatMessage[],
  isSpeechEnabled: boolean,
  formData: GptFormData,
  taskInProgress?: string
): Promise<{
  message: string;
  audioUrl: string | null;
  formDataUpdate: Partial<GptFormData> | null;
  identityUpdate: Partial<Pick<GptFormData, "name" | "position">> | null;
  messageHistory?: { role: string; content?: string }[] | null;
}> => {
  const payload = {
    messages: messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
    isSpeechEnabled,
    formData,
    ...(taskInProgress && { taskInProgress }), // Only include if truthy
  };

  const res = await fetch(import.meta.env.VITE_API_URL + "IOGpt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  const message = data.message;
  let messageHistory: ChatMessage[] = data.messageHistory;

  console.log(" data: ", data);

  if (!res.ok || !data.message) {
    throw new Error("Error fetching response");
  }

  // Ensure latest assistant message is included in messageHistory
  if (
    data.message &&
    (!data.messageHistory?.length ||
      !messageHistory.some(
        (m) => m.role === "assistant" && m.content?.trim() === message.trim()
      ))
  ) {
    messageHistory = [
      ...(messageHistory || []),
      { role: "assistant", content: message },
    ];
  }

  console.log("taskInProgress in fetchBotResponse:", taskInProgress);

  const wrappedFormDataUpdate =
    data.formDataUpdate && taskInProgress
      ? {
          tasks: {
            [taskInProgress]: data.formDataUpdate,
          },
        }
      : null;

  return {
    message: data.message,
    audioUrl: data.audioUrl || null,
    formDataUpdate: wrappedFormDataUpdate,
    identityUpdate: data.identityUpdate || null,
    messageHistory,
  };
};
