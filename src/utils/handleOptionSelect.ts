// utils/handleTaskOptionSelect.ts

import { ChatMessage, GptFormData } from "../types";

interface HandleTaskOptionSelectArgs {
  msgIndex: number;
  optionIndex: number;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>;
}

export function handleTaskOptionSelect({
  msgIndex,
  optionIndex,
  messages,
  setMessages,
  setFormData,
}: HandleTaskOptionSelectArgs) {
  const msg = messages[msgIndex];

  if (
    msg.type === "options" &&
    typeof msg.content === "object" &&
    "options" in msg.content
  ) {
    const selectedTask = msg.content.options[optionIndex];
    // const newTaskId = crypto.randomUUID();

    setMessages((prev) => {
      const updated = [...prev];
      const target = updated[msgIndex];
      if (
        target.type === "options" &&
        typeof target.content === "object" &&
        "options" in target.content
      ) {
        target.content.selected = optionIndex;
      }

      return [
        ...updated,
        {
          role: "user",
          type: "text",
          content: selectedTask,
        },
      ];
    });

    setFormData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [selectedTask]: {
          frequencyAndTime: null,
          difficulty: null,
          addedValue: null,
          implicitPriority: null,
          duration: null,
        },
      },
    }));
  }
}
