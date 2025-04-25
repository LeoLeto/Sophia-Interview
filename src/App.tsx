import { useState } from "react";
import LoginPage from "./views/LoginPage";
import MainLayout from "./views/MainLayout"; // your App content moved here
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <MainLayout setIsLoggedIn={setIsLoggedIn} />
  ) : (
    <LoginPage setIsLoggedIn={setIsLoggedIn} />
  );
}

export default App;
