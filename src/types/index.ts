export type ChatMessage =
  | {
      role: "user" | "assistant" | "system";
      type: "text";
      content: string;
    }
  | {
      role: "assistant";
      type: "options";
      content: {
        options: string[];
        selected?: number;
      };
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
