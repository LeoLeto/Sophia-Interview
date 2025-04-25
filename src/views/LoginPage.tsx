import React, { useState, useEffect } from "react";
import styles from "./LoginPage.module.css";

type LoginPageProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [randomImage, setRandomImage] = useState<string>("");

  // Randomly pick an image on initial load
  useEffect(() => {
    const images = ["src/assets/cover.jpg", "src/assets/cover2.jpg"];
    const selectedImage = images[Math.floor(Math.random() * images.length)];
    setRandomImage(selectedImage);
  }, []);

  const handleLogin = () => {
    if (username === "123" && password === "123") {
      setIsLoggedIn(true);
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="mainLayout">
      <div className="leftSection">
        <div className={styles.loginContainer}>
          <h2>Iniciar sesión</h2>
          <div className={styles.formGroup}>
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su nombre de usuario"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
            />
          </div>
          <button className={styles.loginButton} onClick={handleLogin}>
            Iniciar sesión
          </button>
          {error && <p className={styles.error}>{error}</p>}
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
