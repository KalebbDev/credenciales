import React, { useState, useEffect } from "react";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");

  // Cargar usuarios al montar la página
  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3020/api/v1/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsuarios(data.data || []);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      }
    };
    fetchUsuarios();
  }, []);

  // Acción de deshabilitar usuario
  const deshabilitarUsuario = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3020/api/v1/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clave_estatus: 0 }),
      });
      const data = await res.json();
      alert(`Usuario ${data.nombre} deshabilitado`);
      setUsuarios((prev) =>
        prev.map((u) => (u._id === id ? { ...u, clave_estatus: 0 } : u))
      );
    } catch (err) {
      alert("Error al deshabilitar usuario");
    }
  };

  // Acción de editar usuario (placeholder)
  const editarUsuario = (usuario) => {
    alert(`Editar usuario: ${usuario.nombre}`);
    // Aquí puedes abrir un modal con formulario de edición
  };

  // Acción de registrar nuevo usuario (placeholder)
  const registrarUsuario = () => {
    alert("Registrar nuevo usuario");
    // Aquí puedes abrir un modal con formulario de creación
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Administración de Usuarios</h2>

      {/* Buscador y botón nuevo */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, marginRight: "10px", padding: "8px" }}
        />
        <button style={styles.addButton} onClick={registrarUsuario}>
          ➕ Registrar Usuario
        </button>
      </div>

      {/* Tabla */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios
            .filter((u) =>
              u.nombre.toLowerCase().includes(search.toLowerCase()) ||
              u.correo.toLowerCase().includes(search.toLowerCase())
            )
            .map((u) => (
              <tr key={u._id}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>{u.clave_estatus === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <button
                    style={styles.actionButton}
                    onClick={() => editarUsuario(u)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() => deshabilitarUsuario(u._id)}
                  >
                    🚫 Deshabilitar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    borderBottom: "2px solid #ccc",
    textAlign: "left",
    padding: "8px",
  },
  td: {
    borderBottom: "1px solid #eee",
    padding: "8px",
  },
  actionButton: {
    marginRight: "8px",
    padding: "6px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    background: "#64748b",
    color: "#fff",
  },
  addButton: {
    padding: "8px 12px",
    background: "#22c55e",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
  },
};

export default UsuariosPage;
