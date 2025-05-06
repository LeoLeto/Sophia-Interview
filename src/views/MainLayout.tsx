import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import { Chatbox } from "../components/Chatbox";
import { Messages } from "../components/Messages";
import SummaryModal from "../components/SummaryModal";
import { ChatMessage, GptFormData } from "../types";
import { handleSendMessage } from "../utils/chatHandler";
import { getGenderedGreeting } from "../utils/getGenderedGreeting";
import { startInterview } from "../utils/startInterview";

interface MainLayoutProps {
  setIsLoggedIn: (value: boolean) => void;
}

function MainLayout({ setIsLoggedIn }: MainLayoutProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isChatInitiated, setIsChatInitiated] = useState<boolean>(false);
  const [taskInProgress, setTaskInProgress] = useState<string>("");

  const [formData, setFormData] = useState<GptFormData>({
    name: null,
    position: null,
    tasks: {},
  });

  useEffect(() => {
    console.log("formData:", formData);
  }, [formData]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  const handleInitiateChat = async () => {
    setIsChatInitiated(true);
    setLoading(true);

    const initialBotMessage = await startInterview(isSpeechEnabled, formData);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: initialBotMessage.message },
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
      taskInProgress,
      setTaskInProgress
    );
  };

  return (
    <div className="mainLayout">
      <span className="leftSection">
        <Avatar
          isSpeechEnabled={isSpeechEnabled}
          setIsSpeechEnabled={setIsSpeechEnabled}
        />
        {formData.name ? (
          <p className="welcomeLabel">{getGenderedGreeting(formData.name)}</p>
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
        {!isChatInitiated && (
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
