import { ChangeEvent, KeyboardEvent } from "react";

type ChatboxProps = {
  onSendMessage: (message: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  loading: boolean;
};

export function Chatbox({
  onSendMessage,
  inputValue,
  setInputValue,
  loading
}: ChatboxProps) {
  const handleSend = () => {
    if (inputValue.trim() !== "") {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="chatboxContainer">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Escribe aquí tu mensaje..."
        disabled={loading}
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? "..." : "Enviar"}
      </button>
    </div>
  );
}
