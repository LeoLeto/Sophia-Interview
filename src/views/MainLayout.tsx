import { useState } from "react";
import Avatar from "../components/Avatar";
import { Chatbox } from "../components/Chatbox";
import { Messages } from "../components/Messages";
import { GptFormData, Message } from "../types";
import { handleSendMessage } from "../utils/chatHandler";
import {
  isIdentityComplete,
  isTaskFormComplete,
} from "../utils/isFormDataComplete";
import SummaryModal from "../components/SummaryModal";

interface MainLayoutProps {
  setIsLoggedIn: (value: boolean) => void;
}

function MainLayout({ setIsLoggedIn }: MainLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState(false);

  const [formData, setFormData] = useState<GptFormData>({
    name: null,
    position: null,
    frequencyAndTime: null,
    difficulty: null,
    addedValue: null,
    implicitPriority: null,
  });

  const [taskInProgress, setTaskInProgress] = useState<string>("");

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSend = async (newMessage: string) => {
    await handleSendMessage(
      newMessage,
      messages,
      setMessages,
      setLoading,
      isSpeechEnabled,
      formData,
      setFormData,
      taskInProgress
    );

    // If task is defined and form is complete, reset for next task
    if (
      taskInProgress &&
      isTaskFormComplete(formData) &&
      isIdentityComplete(formData)
    ) {
      setTimeout(() => {
        setTaskInProgress("");
        setFormData((prev) => ({
          ...prev,
          frequencyAndTime: null,
          difficulty: null,
          addedValue: null,
          implicitPriority: null,
        }));
      }, 1500);
    }
  };

  return (
    <div className="mainLayout">
      <span className="leftSection">
        <Avatar
          isSpeechEnabled={isSpeechEnabled}
          setIsSpeechEnabled={setIsSpeechEnabled}
        />
        <p className="welcomeLabel">Bienvenido, Juan Doe</p>
        <button>Iniciar</button>
        <button onClick={() => setShowSummary(true)}>Ver resumen</button>
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

      {showSummary && (
        <SummaryModal
          formData={formData}
          taskInProgress={taskInProgress}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}

export default MainLayout;
