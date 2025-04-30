import { useState } from "react";
import { Chatbox } from "../components/Chatbox";
import { Messages } from "../components/Messages";
import { GptFormData, Message } from "../types";
import { handleSendMessage } from "../utils/chatHandler";
import Avatar from "../components/Avatar";
import { isFormDataComplete } from "../utils/isFormDataComplete";

interface MainLayoutProps {
  setIsLoggedIn: (value: boolean) => void;
}

function MainLayout({ setIsLoggedIn }: MainLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(false);

  const [formData, setFormData] = useState<GptFormData>({
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
    if (taskInProgress && isFormDataComplete(formData)) {
      setTimeout(() => {
        setTaskInProgress(""); // Clear task
        setFormData({
          frequencyAndTime: null,
          difficulty: null,
          addedValue: null,
          implicitPriority: null,
        });
      }, 1500); // Delay reset so user sees wrap-up message
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

      {Object.values(formData).some((value) => value !== null) && (
        <div className="formDataSummary">
          <h4>Información recopilada:</h4>
          <ul>
            {formData.frequencyAndTime && (
              <li>
                <strong>Frecuencia y tiempo:</strong>{" "}
                {formData.frequencyAndTime}
              </li>
            )}
            {formData.difficulty && (
              <li>
                <strong>Dificultad:</strong> {formData.difficulty}
              </li>
            )}
            {formData.addedValue && (
              <li>
                <strong>Valor agregado:</strong> {formData.addedValue}
              </li>
            )}
            {formData.implicitPriority && (
              <li>
                <strong>Priorización implícita:</strong>{" "}
                {formData.implicitPriority}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MainLayout;
