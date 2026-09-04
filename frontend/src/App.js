import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [usuario, setUsuario] = useState(null);

  const handleLogin = (usuarioData) => {
    setUsuario(usuarioData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard usuario={usuario} onLogout={handleLogout} />;
}

export default App;
