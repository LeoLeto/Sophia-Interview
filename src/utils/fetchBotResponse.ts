// import { ChatMessage, GptFormData } from "../types";

// export const fetchBotResponse = async (
//   messages: ChatMessage[],
//   isSpeechEnabled: boolean,
//   formData: GptFormData,
//   taskInProgress: string | undefined,
//   userEmail: string,
//   sessionId: string
// ): Promise<{
//   message: string;
//   audioUrl: string | null;
//   formDataUpdate: Partial<GptFormData> | null;
//   identityUpdate: Partial<Pick<GptFormData, "name" | "position">> | null;
//   messageHistory?: ChatMessage[] | null;
// }> => {
//   const payload = {
//     messages: messages.map((msg) => ({
//       role: msg.role,
//       content: msg.content,
//     })),
//     isSpeechEnabled,
//     formData,
//     ...(taskInProgress && { taskInProgress }),
//     userEmail,
//     sessionId,
//   };

//   const res = await fetch(import.meta.env.VITE_API_URL + "IOGpt", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const data = await res.json();
//   const message = data.message;
//   let messageHistory: ChatMessage[] = data.messageHistory;

//   console.log("data:", data);
//   console.log("taskInProgress in fetchBotResponse:", taskInProgress);

//   if (!res.ok || !data.message) {
//     throw new Error("Error fetching response");
//   }

//   if (
//     data.message &&
//     (!data.messageHistory?.length ||
//       !messageHistory.some(
//         (m) =>
//           m.role === "assistant" &&
//           m.type === "text" &&
//           m.content.trim() === message.trim()
//       ))
//   ) {
//     messageHistory = [
//       ...(messageHistory || []),
//       {
//         type: "text",
//         role: "assistant",
//         content: message,
//       },
//     ];
//   }

//   const wrappedFormDataUpdate = data.formDataUpdate
//     ? {
//         name: data.formDataUpdate.name ?? undefined,
//         position: data.formDataUpdate.position ?? undefined,
//         tasks: data.formDataUpdate.tasks ?? {},
//       }
//     : null;

//   return {
//     message,
//     audioUrl: data.audioUrl || null,
//     formDataUpdate: wrappedFormDataUpdate,
//     identityUpdate: data.identityUpdate || null,
//     messageHistory,
//   };
// };
