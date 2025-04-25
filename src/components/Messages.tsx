type Message = {
  sender: "user" | "bot";
  text: string;
};

export function Messages({ messages }: { messages: Message[] }) {
  return (
    <div className="messagesContainer">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={msg.sender === "user" ? "userMessage" : "botMessage"}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
