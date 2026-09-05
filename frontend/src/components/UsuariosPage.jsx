import React, { useState, useEffect } from "react";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null); // usuario logueado
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" o "edit"
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    edad: "",
    contrasena: "",
    rol: "ADMIN",
  });

  // Cargar usuario logueado desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  // Cargar usuarios al montar la página
  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3020/api/v1/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsuarios(data || []);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      }
    };
    fetchUsuarios();
  }, []);

  // Acción de habilitar/deshabilitar usuario
  const toggleUsuario = async (id, estatusActual) => {
    const token = localStorage.getItem("token");
    try {
      const nuevoEstatus = estatusActual === 1 ? 0 : 1;
      const res = await fetch(`http://localhost:3020/api/v1/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clave_estatus: nuevoEstatus }),
      });
      const data = await res.json();
      alert(`Usuario ${data.nombre} ${nuevoEstatus === 1 ? "habilitado" : "deshabilitado"}`);
      setUsuarios((prev) =>
        prev.map((u) => (u._id === id ? { ...u, clave_estatus: nuevoEstatus } : u))
      );
    } catch (err) {
      alert("Error al cambiar estatus de usuario");
    }
  };

  // Acción eliminar usuario
  const eliminarUsuario = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3020/api/v1/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await res.json();
      alert("✅ Usuario eliminado correctamente");
      setUsuarios((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert("❌ Error al eliminar usuario");
    }
  };

  // Acción de editar usuario
  const editarUsuario = (usuario) => {
    setModalMode("edit");
    setSelectedUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      edad: usuario.edad || "",
      contrasena: "",
      rol: usuario.rol,
    });
    setShowModal(true);
  };

  // Acción de registrar nuevo usuario
  const registrarUsuario = () => {
    setModalMode("create");
    setSelectedUser(null);
    setFormData({ nombre: "", correo: "", edad: "", contrasena: "", rol: "USER" });
    setShowModal(true);
  };

  // Guardar cambios (crear o editar)
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      if (modalMode === "create") {
        const res = await fetch("http://localhost:3020/api/v1/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData, clave_estatus: 1 }),
        });
        const data = await res.json();
        const nuevoUsuario = data.data;
        setUsuarios((prev) => [...prev, nuevoUsuario]);
        alert("✅ Usuario creado correctamente");
      } else {
        const res = await fetch(`http://localhost:3020/api/v1/usuarios/${selectedUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        await res.json();
        setUsuarios((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? { ...u, ...formData } : u))
        );
        alert("✅ Usuario editado correctamente");
      }
      setShowModal(false);
    } catch (err) {
      alert("❌ Error al guardar usuario");
    }
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
            <th>Edad</th>
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
                <td>{u.edad}</td>
                <td>{u.rol}</td>
                <td>{u.clave_estatus === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <button style={styles.actionButton} onClick={() => editarUsuario(u)}>
                    ✏️ Editar
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() => toggleUsuario(u._id, u.clave_estatus)}
                  >
                    {u.clave_estatus === 1 ? "🚫 Deshabilitar" : "✅ Habilitar"}
                  </button>
                  {/* Solo se muestra si el usuario logueado es SUPER_ADMINISTRADOR */}
                  {usuario?.rol === "SUPER_ADMINISTRADOR" && (
                    <button
                      style={{ ...styles.actionButton, background: "red" }}
                      onClick={() => eliminarUsuario(u._id)}
                    >
                      🗑 Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>{modalMode === "create" ? "Registrar Usuario" : "Editar Usuario"}</h3>
            <input
              style={styles.input}
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Correo"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Edad"
              type="number"
              value={formData.edad}
              onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
            />
            {/* Solo mostrar el campo de contraseña si el logueado es SUPER_ADMINISTRADOR */}
            {usuario?.rol === "SUPER_ADMINISTRADOR" && (
              <input
                style={styles.input}
                placeholder="Contraseña"
                type="password"
                value={formData.contrasena}
                onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              />
            )}
            <select
              style={styles.input}
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
            >
              {usuario?.rol === "SUPER_ADMINISTRADOR" && (
                <option value="SUPER_ADMINISTRADOR">Super Administrador</option>
              )}
              <option value="ADMIN">Administrador</option>
              <option value="ENCARGADO">Encargado</option>
            </select>
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button style={styles.saveButton} onClick={handleSave}>💾 Guardar</button>
              <button style={styles.cancelButton} onClick={() => setShowModal(false)}>❌ Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


const styles = {
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  actionButton: {
    marginRight: "8px", padding: "6px 10px", border: "none", borderRadius: "4px",
    cursor: "pointer", background: "#64748b", color: "#fff",
  },
  addButton: {
    padding: "8px 12px", background: "#22c55e", border: "none", borderRadius: "5px",
    color: "#fff", cursor: "pointer",
  },
  input: {
    width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px",
  },
  modalOverlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center",
  },
  modal: {
    background: "#fff", padding: "20px", borderRadius: "8px", width: "400px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  saveButton: {
    padding: "8px 12px", background: "#2563eb", border: "none", borderRadius: "5px",
    color: "#fff", cursor: "pointer", marginRight: "10px",
  },
  cancelButton: {
    padding: "8px 12px", background: "#dc2626", border: "none", borderRadius: "5px",
    color: "#fff", cursor: "pointer",
  },
};

export default UsuariosPage;
