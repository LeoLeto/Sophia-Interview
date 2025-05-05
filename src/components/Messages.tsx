import { useEffect, useRef } from "react";
import { ChatMessage } from "../types";

export function Messages({ messages }: { messages: ChatMessage[] }) {
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
          {msg.content}
        </div>
      ))}
      {/* Invisible anchor div to scroll into view */}
      <div ref={messagesEndRef} />
    </div>
  );
}
