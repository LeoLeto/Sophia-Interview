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
import { startInterview } from "../utils/startInterview";

interface MainLayoutProps {
  setIsLoggedIn: (value: boolean) => void;
}

function MainLayout({ setIsLoggedIn }: MainLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isChatInitiated, setIsChatInitiated] = useState<boolean>(false);

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
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  const handleInitiateChat = async () => {
    setIsChatInitiated(true);
    setLoading(true);

    const initialBotMessage = await startInterview(
      isSpeechEnabled,
      formData,
      taskInProgress
    );

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: initialBotMessage.message },
    ]);

    setLoading(false);
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
        {formData.name ? (
          <p className="welcomeLabel">Bienvenido, {formData.name}</p>
        ) : (
          <p className="welcomeLabel">Bienvenido</p>
        )}
        <button
          className={`${isChatInitiated ? "disabled" : ""}`}
          onClick={handleInitiateChat}
          disabled={isChatInitiated}
        >
          Iniciar
        </button>
        <button onClick={() => setShowSummary(true)}>Ver resumen</button>
        <button className="logoutButton" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </span>
      <span className="rightSection">
        {messages.length === 0 && (
          <div className="initialHelperMessage">
            💬 Haz click en Iniciar para comenzar tu entrevista
          </div>
        )}
        <Messages messages={messages} />
        {loading && <div className="spinner">⏳</div>}
        <Chatbox
          onSendMessage={handleSend}
          inputValue={inputValue}
          setInputValue={setInputValue}
          loading={loading}
          isChatInitiated={isChatInitiated}
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
