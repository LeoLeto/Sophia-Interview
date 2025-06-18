import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

type ChatboxProps = {
  onSendMessage: (message: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  loading: boolean;
  isChatInitiated: boolean;
  indexIdentityStep: number;
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
  indexIdentityStep,
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
    if (indexIdentityStep == 1) return "Escribe aquí tu nombre"
    if (indexIdentityStep == 2) return "Escribe aquí el nombre de tu empresa"
    return "Escribe aquí tu mensaje...";
  };

  return (
    <div className={`chatboxContainer ${!isChatInitiated ? "disabled" : ""}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholder()}
        disabled={loading || !isChatInitiated}
      />

      <button
        onClick={listening ? handleStopDictation : handleStartDictation}
        className={`micButton ${listening ? "listening" : ""}`}
        disabled={loading || !isChatInitiated}
      >
        🎤
      </button>

      <button onClick={handleSend} disabled={loading || !isChatInitiated}>
        {loading ? "..." : "Enviar"}
      </button>
    </div>
  );
}
