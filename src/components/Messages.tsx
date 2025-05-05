import { ChatMessage } from "../types";

export function Messages({ messages }: { messages: ChatMessage[] }) {
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
    </div>
  );
}
