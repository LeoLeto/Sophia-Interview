// import { fetchBotResponse } from "./fetchBotResponse";
// import { GptFormData, ChatMessage } from "../types";

// export const startInterview = async (
//   isSpeechEnabled: boolean,
//   formData: GptFormData,
//   sessionId: string,
//   userId: string
// ): Promise<{
//   message: string;
//   formDataUpdate: Partial<GptFormData> | null;
//   messageHistory?: { role: string; content?: string }[] | null;
// }> => {
//   const initialMessage: ChatMessage = {
//     role: "system",
//     // content: "Hola",
//     content:
//       "¡Hola! Es un placer tenerte aquí. Mi objetivo hoy es conocerte mejor, entender tu rol, las tareas que realizas y cómo se llevan a cabo, para así identificar oportunidades en las que podríamos mejorar tu productividad, tal vez incluso con la ayuda de la inteligencia artificial. Para comenzar, ¿podrías decirme tu nombre y cuál es tu cargo actual en la empresa?",
//   };

//   try {
//     const {
//       message: botMessage,
//       formDataUpdate,
//       messageHistory,
//     } = await fetchBotResponse(
//       [initialMessage],
//       isSpeechEnabled,
//       formData,
//       undefined,
//       userId,
//       sessionId
//     );

//     return {
//       message: botMessage,
//       formDataUpdate,
//       messageHistory,
//     };
//   } catch (error) {
//     console.error("Error starting interview:", error);
//     return {
//       message: "Lo siento, ocurrió un error al iniciar la entrevista.",
//       formDataUpdate: null,
//       messageHistory: null,
//     };
//   }
// };
