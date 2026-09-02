import React, { useEffect, useState } from "react";

const API = "http://localhost:3020/api/v1/usuarios";

function UserList({ setUsuarioEdit }) {   // 👈 recibe la prop aquí
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setUsuarios(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    // refresca lista
    fetch(API)
      .then(res => res.json())
      .then(data => setUsuarios(data));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lista de Usuarios</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#1976d2", color: "white" }}>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Edad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u._id}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.edad}</td>
              <td>
                <button onClick={() => setUsuarioEdit(u)}>Editar</button>
                <button onClick={() => handleDelete(u._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
