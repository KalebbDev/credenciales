import React, { useState } from "react";

const API = "http://localhost:3020/api/v1/usuarios";

function UserEdit({ usuario, onUpdated }) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [correo, setCorreo] = useState(usuario.correo);
  const [edad, setEdad] = useState(usuario.edad);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/${usuario._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, edad }),
    });
    onUpdated(); // refresca lista y cierra edición
  };

  return (
    <form onSubmit={handleUpdate}>
      <h3>Editar Usuario</h3>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input value={correo} onChange={(e) => setCorreo(e.target.value)} />
      <input value={edad} onChange={(e) => setEdad(e.target.value)} />
      <button type="submit">Actualizar</button>
    </form>
  );
}

export default UserEdit;

