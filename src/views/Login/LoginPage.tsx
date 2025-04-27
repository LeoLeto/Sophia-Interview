import React, { useEffect, useState } from "react";
import styles from "./LoginPage.module.css";
import useLogin from "./useLogin";

type LoginPageProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
  const [randomImage, setRandomImage] = useState<string>("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showContent, setShowContent] = useState<boolean>(false);

  // Set random image only once on initial load
  useEffect(() => {
    const images = ["src/assets/cover.jpg", "src/assets/cover2.jpg"];
    const selectedImage = images[Math.floor(Math.random() * images.length)];
    setRandomImage(selectedImage);

    // Trigger fade effect when the component mounts or mode switches
    setShowContent(true);
  }, []); // Empty dependency array to only run once on mount

  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin(setIsLoggedIn, mode);

  const toggleMode = () => {
    setShowContent(false); // Fade out when switching
    setTimeout(() => {
      setMode((prev) => (prev === "login" ? "register" : "login"));
      setShowContent(true); // Fade in the content after mode switch
    }, 200); // Faster fade-out before switching mode
  };

  return (
    <div className="mainLayout">
      <div className="leftSection">
        <div className={styles.loginContainer}>
          {/* Apply fade effect only to the content inside */}
          <div
            className={`${styles.loginContent} ${
              showContent ? styles.show : ""
            }`}
          >
            <h2>{mode === "login" ? "Iniciar sesión" : "Registrarse"}</h2>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su email"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                disabled={loading}
              />
            </div>

            <button
              className={styles.loginButton}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Cargando..."
                : mode === "login"
                ? "Iniciar sesión"
                : "Registrarse"}
            </button>

            {error && <p className={styles.error}>{error}</p>}

            <p className={styles.toggleLink} onClick={toggleMode}>
              {mode === "login"
                ? "¿No tienes cuenta? Regístrate aquí"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </p>
          </div>
        </div>
      </div>

      <div className="rightSection">
        <img
          className={styles.loginCover}
          src={randomImage}
          alt="Login cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
