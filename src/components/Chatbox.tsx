import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

type ChatboxProps = {
  onSendMessage: (message: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  loading: boolean;
};

// Define minimal types needed
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
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
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
        setIsListening(false);
      };
    }

    setIsListening(true);
    recognitionRef.current.start();
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
      <button onClick={startListening} disabled={isListening || loading}>
        {isListening ? "🎙️ Grabando..." : "🎤"}
      </button>
      <button onClick={handleSend} disabled={loading}>
        {loading ? "..." : "Enviar"}
      </button>
    </div>
  );
}
