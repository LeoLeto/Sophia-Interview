// Messages.tsx
import { useEffect, useRef } from "react";
import { ChatMessage } from "../types";

type OptionContent =
  | { options: string[]; selected?: number } // Task or string options
  | { options: (string | number)[]; selected?: number }; // Numeric with labels

export function Messages({
  messages,
  onOptionSelect,
}: {
  messages: ChatMessage[];
  onOptionSelect: (msgIndex: number, optionIndex: number) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messagesContainer">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={msg.role === "user" ? "userMessage" : "botMessage"}
        >
          {msg.type === "text" && <span>{msg.content as string}</span>}

          {msg.type === "options" && (
            <div className="optionsContainer">
              {(msg.content as OptionContent).options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => onOptionSelect(idx, i)}
                  disabled={
                    (msg.content as OptionContent).selected !== undefined
                  }
                  className="optionButton"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
