import { useState, useEffect } from "react";
import Login from "./components/Login";
import Home from "./components/Home";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
      setLoggedIn(true);
    }
  }, []);

  return loggedIn ? <Home /> : <Login onLogin={() => setLoggedIn(true)} />;
}
