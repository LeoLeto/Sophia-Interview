import { ChatMessage } from "../../types";
import { FIELD_OPTIONS } from "../handleSendMessage/taskTypes";
import { getPromptForField } from "./getPromptForField";

type Args = {
  fieldKey: keyof typeof FIELD_OPTIONS | "addedValue" | "implicitPriority";
  taskKey: string;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};

export function askNextField({ fieldKey, taskKey, setMessages }: Args) {
  const message = getPromptForField(fieldKey, taskKey);

  // Text input for addedValue
  if (fieldKey === "addedValue") {
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        role: "assistant",
        content: message,
      },
    ]);
    return;
  }

  // Options for implicitPriority
  if (fieldKey === "implicitPriority") {
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        role: "assistant",
        content: message,
      },
      {
        type: "options",
        role: "assistant",
        content: {
          options: ["Baja", "Media", "Alta"],
        },
        meta: {
          field: "implicitPriority",
          taskKey,
        },
      },
    ]);
    return;
  }

  // Standard options flow
  const options = FIELD_OPTIONS[fieldKey];
  if (options) {
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        role: "assistant",
        content: message,
      },
      {
        type: "options",
        role: "assistant",
        content: {
          options,
        },
        meta: {
          field: fieldKey,
          taskKey, // ✅ Include this here
        },
      },
    ]);
  } else {
    console.warn(`[askNextField] No options defined for field: ${fieldKey}`);
  }
}
