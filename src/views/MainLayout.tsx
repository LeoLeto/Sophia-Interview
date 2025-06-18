import { useState } from "react";
import Avatar from "../components/Avatar";
import { Chatbox } from "../components/Chatbox";
import { Messages } from "../components/Messages";
import SummaryModal from "../components/SummaryModal";
import { ChatMessage, GptFormData } from "../types";
import { getGenderedGreeting } from "../utils/getGenderedGreeting";
import { handleTaskOptionSelect } from "../utils/handleTaskOptionSelect";
import { handleSendMessage } from "../utils/handleSendMessage/handleSendMessage";

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
  const [taskInProgress, setTaskInProgress] = useState<string | null>(null);
  const [indexIdentityStep, setChatProgressIndex] = useState<number>(0);
  const [indexCurrentTaskField, setindexCurrentTaskField] = useState(0);

  // const [jobTasks, setJobTastks] = useState<string[]>([]);

  const [formData, setFormData] = useState<GptFormData>({
    name: null,
    position: null,
    tasks: {},
  });

  // const sessionId = useRef<string>(crypto.randomUUID());
  // const { userId } = JSON.parse(localStorage.getItem("user") || "{}");

  // useEffect(() => {
  //   console.log("formData:", formData);
  // }, [formData]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  const handleInitiateChat = async () => {
    setIsChatInitiated(true);
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        role: "system",
        content:
          "¡Hola! Es un placer tenerte aquí. Mi objetivo hoy es conocerte mejor, entender tu rol, las tareas que realizas y cómo se llevan a cabo, para así identificar oportunidades en las que podríamos mejorar tu productividad, potencialmente con la ayuda de la inteligencia artificial. Para comenzar, ¿podrías decirme tu nombre?",
      },
    ]);
    setChatProgressIndex(1);
    setLoading(false);
  };
  const setTaskInProgressFromUserSelection = (taskOptions: string[]) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "options",
        role: "assistant", // ✅ FIXED
        content: {
          options: taskOptions,
        },
        meta: {
          field: "task",
        },
      },
    ]);
  };

  const onTaskOptionSelect = (msgIndex: number, optionIndex: number) => {
    handleTaskOptionSelect({
      msgIndex,
      optionIndex,
      messages,
      setMessages,
      setFormData,
      taskInProgress, // add this, from state
      setTaskInProgress,
      indexCurrentTaskField, // add this, from state
      setindexCurrentTaskField,
      formData,
      setTaskInProgressFromUserSelection,
    });
  };

  const handleSend = async (newMessage: string) => {
    await handleSendMessage(
      newMessage,
      // messages,
      setMessages,
      setLoading,
      // isSpeechEnabled,
      // formData,
      setFormData,
      indexIdentityStep,
      setChatProgressIndex,
      taskInProgress,
      setTaskInProgress,
      // sessionId.current!,
      // userId,
      indexCurrentTaskField,
      setindexCurrentTaskField,
      formData,
      setTaskInProgressFromUserSelection
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
        <Messages messages={messages} onOptionSelect={onTaskOptionSelect} />
        {loading && <div className="spinner">⏳</div>}
        <Chatbox
          onSendMessage={handleSend}
          inputValue={inputValue}
          setInputValue={setInputValue}
          loading={loading}
          isChatInitiated={isChatInitiated}
          indexIdentityStep={indexIdentityStep}
        />
      </span>

      {showSummary && (
        <SummaryModal
          formData={formData}
          // taskInProgress={taskInProgress}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}

export default MainLayout;
