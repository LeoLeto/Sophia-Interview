import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

type ChatboxProps = {
  onSendMessage: (message: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  loading: boolean;
  isChatInitiated: boolean;
  indexChatboxReference: number;
  // isChatboxEnabled: boolean;
};

interface SpeechRecognitionType extends EventTarget {
  lang: string;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: (event: CustomSpeechRecognitionEvent) => void;
  onend: () => void;
}

interface CustomSpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

const SpeechRecognitionClass =
  (window as unknown as { SpeechRecognition: new () => SpeechRecognitionType })
    .SpeechRecognition ||
  (
    window as unknown as {
      webkitSpeechRecognition: new () => SpeechRecognitionType;
    }
  ).webkitSpeechRecognition;

export function Chatbox({
  onSendMessage,
  inputValue,
  setInputValue,
  loading,
  isChatInitiated,
  indexChatboxReference,
}: // isChatboxEnabled,
ChatboxProps) {
  const handleSend = () => {
    if (inputValue.trim() !== "") {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (indexChatboxReference === 2 || indexChatboxReference === 4) {
        (e.target as HTMLInputElement).blur();
      }
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const [listening, setListening] = useState(false);

  const handleStartDictation = () => {
    if (!SpeechRecognitionClass) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.lang = "es-ES";
      recognitionRef.current.continuous = false;

      recognitionRef.current.onresult = (
        event: CustomSpeechRecognitionEvent
      ) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((inputValue + " " + transcript).trim());
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }

    recognitionRef.current.start();
    setListening(true);
  };

  const handleStopDictation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const getPlaceholder = (): string => {
    if (loading) return "Cargando...";
    if (!isChatInitiated) return "Inicia el chat para comenzar...";
    if (indexChatboxReference == 1) return "Escribe aquí tu nombre";
    if (indexChatboxReference == 2)
      return "Escribe aquí tu cargo en la empresa";
    if (indexChatboxReference == 3) return "Selecciona una de las opciones";
    if (indexChatboxReference == 4) return "Escribe aquí...";
    return "Escribe aquí tu mensaje...";
  };

  const getIsChatboxEnabled = (): boolean => {
    if (!isChatInitiated) return false;
    if (loading) return false;
    // INDEX CHATBOT REFERENCE:
    // 1 "INPUT NAME"
    // 2 "INPUT OCCUPATION"
    // 3 "SELECT OPTION"
    // 4 "WRITE HERE"
    if (indexChatboxReference === 3) return false;
    return true;
  };

  return (
    <div
      className={`chatboxContainer ${!getIsChatboxEnabled() ? "disabled" : ""}`}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholder()}
        // disabled={loading || !isChatInitiated || !isChatboxEnabled}
      />
      {/* <p>{indexChatboxReference}</p> */}
      <button
        onClick={listening ? handleStopDictation : handleStartDictation}
        className={`micButton ${listening ? "listening" : ""}`}
        // disabled={loading || !isChatInitiated || !isChatboxEnabled}
      >
        🎤
      </button>

      <button
        onClick={handleSend}
        // disabled={loading || !isChatInitiated || !isChatboxEnabled}
      >
        {loading ? "..." : "Enviar"}
      </button>
    </div>
  );
}
