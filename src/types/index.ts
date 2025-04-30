export type Message = {
  sender: "user" | "bot";
  text: string;
};

export type GptFormData = {
  frequencyAndTime: string | null;
  difficulty: string | null;
  addedValue: string | null;
  implicitPriority: string | null;
};