export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type GptFormData = {
  name: string | null;
  position: string | null;
  frequencyAndTime: string | null;
  difficulty: string | null;
  addedValue: string | null;
  implicitPriority: string | null;
};
