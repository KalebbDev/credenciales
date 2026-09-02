/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/


import React, { useState } from "react";
import UserList from "./UserList";
import UserForm from "./UserForm";
import UserEdit from "./UserEdit";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);

  const handleUserAdded = () => setRefresh(!refresh);
  const handleUserUpdated = () => {
    setUsuarioEdit(null);
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <UserForm onUserAdded={handleUserAdded} />
      {usuarioEdit && (
        <UserEdit usuario={usuarioEdit} onUpdated={handleUserUpdated} />
      )}
      <UserList key={refresh} setUsuarioEdit={setUsuarioEdit} />
    </div>
  );
}

export default App;
