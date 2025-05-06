export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface TaskFormData {
  frequencyAndTime: string | null;
  difficulty: string | null;
  addedValue: string | null;
  implicitPriority: string | null;
}

export interface GptFormData {
  name: string | null;
  position: string | null;
  tasks: Record<string, TaskFormData>; // key = task name
}
