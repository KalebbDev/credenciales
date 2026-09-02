import React, { useState } from "react";

const API = "http://localhost:3020/api/v1/usuarios";

function UserForm({ onUserAdded }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [edad, setEdad] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoUsuario = { nombre, correo, edad };
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    });
    setNombre("");
    setCorreo("");
    setEdad("");
    onUserAdded(); // refresca la lista
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Edad"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
        required
      />
      <button type="submit">Crear Usuario</button>
    </form>
  );
}

export default UserForm;
