export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface GptFormData {
  name: string | null;
  position: string | null;
  tasks: Record<string, TaskFormData>;
}

export type TaskFormData = {
  frequencyAndTime?: string;
  difficulty?: string;
  addedValue?: string;
  implicitPriority?: string;
};
