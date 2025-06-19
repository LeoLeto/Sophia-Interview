import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useLogin = (
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
  mode: "login" | "register"
) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = mode === "login" ? "IOLogin" : "IORegister"; // Use different URL based on mode
      const response = await fetch(import.meta.env.VITE_API_URL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-functions-key": import.meta.env.AZURE_FUNCTION_KEY,
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (response.status === 200) {
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify(userData));
        setIsLoggedIn(true);
        navigate("/dashboard"); // Navigate to dashboard after successful login/register
      } else if (response.status === 201) {
        // Successful user creation (register)
        setError(""); // Clear any previous errors
        setIsLoggedIn(true); // Automatically log the user in after registration
        navigate("/dashboard"); // Navigate to dashboard after successful registration
      } else if (response.status === 203) {
        setError("Contraseña incorrecta.");
      } else if (response.status === 204) {
        setError("Usuario no encontrado.");
      } else {
        setError("Error al procesar la solicitud. Intente más tarde.");
      }
    } catch (error) {
      console.error(error);
      setError("Error de red o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  };
};

export default useLogin;
