import { TaskFormData } from "../utils/handleSendMessage/taskTypes";

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
      meta?: {
        field: string; // e.g. "task", "frequency", "duration", etc.
      };
    };

export interface GptFormData {
  name: string | null;
  position: string | null;
  tasks: Record<string, TaskFormData>;
}
