import { ChatMessage, GptFormData } from "../../types";

export function handleNameStep(
  newMessage: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>,
  setindexIdentityStep: React.Dispatch<React.SetStateAction<number>>
) {
  setFormData((prev) => ({
    ...prev,
    name: newMessage.trim() || prev.name,
  }));

  setMessages((prev) => [
    ...prev,
    {
      type: "text",
      role: "system",
      content: "Y ahora, ¿podrías decirme tu cargo en la empresa?",
    },
  ]);

  setindexIdentityStep(2);
}
