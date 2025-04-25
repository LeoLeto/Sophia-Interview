import { useState } from "react";
import "./App.css";
import { Chatbox } from "./components/Chatbox";
import { Messages } from "./components/Messages";
import { Message } from "./types";
import { handleSendMessage } from "./utils/chatHandler";

function Avatar() {
  return (
    <div className="avatarContainer">
      <img src="src/assets/avatar_f.jpg" alt="avatar" />
    </div>
  );
}

function App() {
  const handleSend = async (newMessage: string) => {
    await handleSendMessage(newMessage, messages, setMessages, setLoading);
  };

  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState<string>("");

  return (
    <div className="mainLayout">
      <span className="leftSection">
        <Avatar />
        <p className="welcomeLabel">Bienvenido, Juan Doe</p>
        <button>Iniciar</button>
      </span>
      <span className="rightSection">
        {messages.length === 0 && (
          <div className="initialHelperMessage">
            💬 Envía un mensaje para iniciar la conversación
          </div>
        )}
        <Messages messages={messages} />
        {loading && <div className="spinner">⏳</div>}
        <Chatbox
          onSendMessage={handleSend}
          inputValue={inputValue}
          setInputValue={setInputValue}
          loading={loading}
        />
      </span>
    </div>
  );
}

export default App;
