// MainLayout.tsx
import { useState } from "react";
import { Chatbox } from "../components/Chatbox";
import { Messages } from "../components/Messages";
import { Message } from "../types";
import { handleSendMessage } from "../utils/chatHandler";
import Avatar from "../components/Avatar";

interface MainLayoutProps {
  setIsLoggedIn: (value: boolean) => void;
}

function MainLayout({ setIsLoggedIn }: MainLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSend = async (newMessage: string) => {
    await handleSendMessage(newMessage, messages, setMessages, setLoading);
  };

  return (
    <div className="mainLayout">
      <span className="leftSection">
        <Avatar />
        <p className="welcomeLabel">Bienvenido, Juan Doe</p>
        <button>Iniciar</button>
        <button className="logoutButton" onClick={handleLogout}>
          Cerrar sesión
        </button>
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

export default MainLayout;
