interface AvatarProps {
  isSpeechEnabled: boolean;
  setIsSpeechEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const Avatar = ({ isSpeechEnabled, setIsSpeechEnabled }: AvatarProps) => {
  const handleToggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
  };

  return (
    <div className="avatarContainer">
      <img src="src/assets/avatar_f.jpg" alt="avatar" />
      <button
        style={{ zIndex: "1" }}
        onClick={handleToggleSpeech}
        className="speechToggleButton"
      >
        {isSpeechEnabled
          ? "🔊 Respuesta hablada activada"
          : "🔇 Respuesta hablada desactivada"}
      </button>
    </div>
  );
};

export default Avatar;
