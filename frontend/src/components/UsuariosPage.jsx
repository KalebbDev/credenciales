import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    edad: "",
    contrasena: "",
    rol: "ADMIN",
  });

  /* =====================================================
     CARGAR USUARIO LOGUEADO
  ===================================================== */

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");

    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    }
  }, []);

  /* =====================================================
     CARGAR USUARIOS
  ===================================================== */

  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://localhost:3020/api/v1/usuarios",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Error al obtener usuarios");
        }

        const data = await res.json();

        setUsuarios(data || []);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No fue posible cargar la lista de usuarios.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#7c3aed",
        });
      }
    };

    fetchUsuarios();
  }, []);

  /* =====================================================
     HABILITAR / DESHABILITAR USUARIO
  ===================================================== */

  const toggleUsuario = async (id, estatusActual) => {
    const token = localStorage.getItem("token");

    const nuevoEstatus = estatusActual === 1 ? 0 : 1;

    const accion =
      nuevoEstatus === 1
        ? "habilitar"
        : "deshabilitar";

    const confirmacion = await Swal.fire({
      icon: "question",
      title: `¿Deseas ${accion} este usuario?`,
      text:
        nuevoEstatus === 1
          ? "El usuario podrá volver a ingresar al sistema."
          : "El usuario ya no podrá ingresar al sistema.",
      showCancelButton: true,
      confirmButtonText:
        nuevoEstatus === 1
          ? "Sí, habilitar"
          : "Sí, deshabilitar",
      cancelButtonText: "Cancelar",
      confirmButtonColor:
        nuevoEstatus === 1
          ? "#16a34a"
          : "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    /* Loading */
    Swal.fire({
      title:
        nuevoEstatus === 1
          ? "Habilitando usuario..."
          : "Deshabilitando usuario...",
      text: "Por favor espera.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch(
        `http://localhost:3020/api/v1/usuarios/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            clave_estatus: nuevoEstatus,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("No fue posible cambiar el estatus");
      }

      const data = await res.json();

      setUsuarios((prev) =>
        prev.map((u) =>
          u._id === id
            ? {
                ...u,
                clave_estatus: nuevoEstatus,
              }
            : u
        )
      );

      Swal.fire({
        icon: "success",
        title:
          nuevoEstatus === 1
            ? "Usuario habilitado"
            : "Usuario deshabilitado",
        text: `El usuario ${
          data.nombre || ""
        } ha sido ${
          nuevoEstatus === 1
            ? "habilitado"
            : "deshabilitado"
        } correctamente.`,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#7c3aed",
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible cambiar el estatus del usuario.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  /* =====================================================
     ELIMINAR USUARIO
  ===================================================== */

  const eliminarUsuario = async (id) => {
    const token = localStorage.getItem("token");

    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar usuario?",
      text: "Esta acción eliminará el usuario del sistema. ¿Deseas continuar?",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    Swal.fire({
      title: "Eliminando usuario...",
      text: "Por favor espera.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch(
        `http://localhost:3020/api/v1/usuarios/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al eliminar usuario");
      }

      await res.json();

      setUsuarios((prev) =>
        prev.filter((u) => u._id !== id)
      );

      Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
        text: "El usuario fue eliminado correctamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#7c3aed",
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: "No fue posible eliminar el usuario.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  /* =====================================================
     EDITAR USUARIO
  ===================================================== */

  const editarUsuario = (usuarioSeleccionado) => {
    setModalMode("edit");

    setSelectedUser(usuarioSeleccionado);

    setFormData({
      nombre: usuarioSeleccionado.nombre || "",
      correo: usuarioSeleccionado.correo || "",
      edad: usuarioSeleccionado.edad || "",
      contrasena: "",
      rol: usuarioSeleccionado.rol || "ADMIN",
    });

    setShowModal(true);
  };

  /* =====================================================
     REGISTRAR USUARIO
  ===================================================== */

  const registrarUsuario = () => {
    setModalMode("create");

    setSelectedUser(null);

    setFormData({
      nombre: "",
      correo: "",
      edad: "",
      contrasena: "",
      rol: "ADMIN",
    });

    setShowModal(true);
  };

  /* =====================================================
     CERRAR MODAL
  ===================================================== */

  const cerrarModal = () => {
    setShowModal(false);

    setSelectedUser(null);

    setFormData({
      nombre: "",
      correo: "",
      edad: "",
      contrasena: "",
      rol: "ADMIN",
    });
  };

  /* =====================================================
     GUARDAR USUARIO
  ===================================================== */

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    /* ================= VALIDACIONES ================= */

    if (!formData.nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Ingresa el nombre del usuario.",
        confirmButtonColor: "#7c3aed",
      });

      return;
    }

    if (!formData.correo.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Ingresa el correo electrónico.",
        confirmButtonColor: "#7c3aed",
      });

      return;
    }

    if (!formData.edad) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Ingresa la edad del usuario.",
        confirmButtonColor: "#7c3aed",
      });

      return;
    }

    if (
      modalMode === "create" &&
      usuario?.rol === "SUPER_ADMINISTRADOR" &&
      !formData.contrasena
    ) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña requerida",
        text: "Ingresa una contraseña para el nuevo usuario.",
        confirmButtonColor: "#7c3aed",
      });

      return;
    }

    /* ================= LOADING ================= */

    Swal.fire({
      title:
        modalMode === "create"
          ? "Registrando usuario..."
          : "Guardando cambios...",
      text: "Por favor espera.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      /* =================================================
         CREAR
      ================================================= */

      if (modalMode === "create") {
        const res = await fetch(
          "http://localhost:3020/api/v1/usuarios",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...formData,
              clave_estatus: 1,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.message ||
              "No fue posible crear el usuario."
          );
        }

        const nuevoUsuario = data.data;

        setUsuarios((prev) => [
          ...prev,
          nuevoUsuario,
        ]);

        cerrarModal();

        Swal.fire({
          icon: "success",
          title: "¡Usuario registrado!",
          text: "El usuario fue creado correctamente.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#7c3aed",
          timer: 2500,
          timerProgressBar: true,
        });
      }

      /* =================================================
         EDITAR
      ================================================= */

      else {
        const res = await fetch(
          `http://localhost:3020/api/v1/usuarios/${selectedUser._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.message ||
              "No fue posible actualizar el usuario."
          );
        }

        setUsuarios((prev) =>
          prev.map((u) =>
            u._id === selectedUser._id
              ? {
                  ...u,
                  ...formData,
                }
              : u
          )
        );

        cerrarModal();

        Swal.fire({
          icon: "success",
          title: "¡Usuario actualizado!",
          text: "Los datos del usuario fueron actualizados correctamente.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#7c3aed",
          timer: 2500,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text:
          err.message ||
          "Ocurrió un error al guardar el usuario.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  /* =====================================================
     FILTRO
  ===================================================== */

  const usuariosFiltrados = usuarios.filter((u) => {
    const nombre = u.nombre?.toLowerCase() || "";
    const correo = u.correo?.toLowerCase() || "";
    const texto = search.toLowerCase();

    return (
      nombre.includes(texto) ||
      correo.includes(texto)
    );
  });

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div style={styles.container}>

      {/* ================= ENCABEZADO ================= */}

      <div style={styles.header}>

        <div>
          <h2 style={styles.title}>
            Administración de Usuarios
          </h2>

         
        </div>

        <button
          style={styles.addButton}
          onClick={registrarUsuario}
        >
          <span style={styles.buttonIcon}>＋</span>
          Registrar Usuario
        </button>

      </div>

      {/* ================= TARJETA ================= */}

      <div style={styles.card}>

        {/* BUSCADOR */}

        <div style={styles.searchContainer}>

          <div style={styles.searchBox}>

            <span style={styles.searchIcon}>
              🔍
            </span>

            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={styles.searchInput}
            />

          </div>

          <div style={styles.totalUsers}>
            <strong>
              {usuariosFiltrados.length}
            </strong>{" "}
            usuarios
          </div>

        </div>

        {/* ================= TABLA ================= */}

        <div style={styles.tableContainer}>

          <table style={styles.table}>

            <thead>
              <tr>
                <th style={styles.th}>
                  Nombre
                </th>

                <th style={styles.th}>
                  Correo
                </th>

                <th style={styles.th}>
                  Edad
                </th>

                <th style={styles.th}>
                  Rol
                </th>

                <th style={styles.th}>
                  Estatus
                </th>

                <th style={styles.th}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>

              {usuariosFiltrados.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    style={styles.empty}
                  >
                    <div style={styles.emptyIcon}>
                      🔍
                    </div>

                    <strong>
                      No se encontraron usuarios
                    </strong>

                    <p>
                      Intenta realizar otra búsqueda.
                    </p>
                  </td>
                </tr>

              ) : (

                usuariosFiltrados.map((u) => (

                  <tr
                    key={u._id}
                    style={styles.tr}
                  >

                    <td style={styles.td}>
                      <div style={styles.nameContainer}>

                        <div style={styles.avatar}>
                          {u.nombre
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <span>
                          {u.nombre}
                        </span>

                      </div>
                    </td>

                    <td style={styles.td}>
                      {u.correo}
                    </td>

                    <td style={styles.td}>
                      {u.edad}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.roleBadge,
                          ...(u.rol ===
                          "SUPER_ADMINISTRADOR"
                            ? styles.superAdmin
                            : u.rol === "ADMIN"
                            ? styles.admin
                            : styles.encargado),
                        }}
                      >
                        {u.rol}
                      </span>
                    </td>

                    <td style={styles.td}>

                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(u.clave_estatus === 1
                            ? styles.statusActive
                            : styles.statusInactive),
                        }}
                      >

                        <span
                          style={styles.statusDot}
                        ></span>

                        {u.clave_estatus === 1
                          ? "Activo"
                          : "Inactivo"}

                      </span>

                    </td>

                    <td style={styles.td}>

                      <div style={styles.actions}>

                        {/* EDITAR */}

                        <button
                          style={{
                            ...styles.actionButton,
                            ...styles.editButton,
                          }}
                          onClick={() =>
                            editarUsuario(u)
                          }
                          title="Editar usuario"
                        >
                          ✏️
                        </button>

                        {/* ESTATUS */}

                        <button
                          style={{
                            ...styles.actionButton,
                            ...(u.clave_estatus === 1
                              ? styles.disableButton
                              : styles.enableButton),
                          }}
                          onClick={() =>
                            toggleUsuario(
                              u._id,
                              u.clave_estatus
                            )
                          }
                          title={
                            u.clave_estatus === 1
                              ? "Deshabilitar usuario"
                              : "Habilitar usuario"
                          }
                        >
                          {u.clave_estatus === 1
                            ? "🚫"
                            : "✅"}
                        </button>

                        {/* ELIMINAR */}

                        {usuario?.rol ===
                          "SUPER_ADMINISTRADOR" && (

                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.deleteButton,
                            }}
                            onClick={() =>
                              eliminarUsuario(u._id)
                            }
                            title="Eliminar usuario"
                          >
                            🗑️
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= MODAL ================= */}

      {showModal && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            {/* HEADER MODAL */}

            <div style={styles.modalHeader}>

              <div>

                <h3 style={styles.modalTitle}>
                  {modalMode === "create"
                    ? "Registrar Usuario"
                    : "Editar Usuario"}
                </h3>

                <p style={styles.modalSubtitle}>
                  {modalMode === "create"
                    ? "Ingresa los datos del nuevo usuario."
                    : "Actualiza la información del usuario."}
                </p>

              </div>

              <button
                style={styles.closeButton}
                onClick={cerrarModal}
              >
                ×
              </button>

            </div>

            {/* FORMULARIO */}

            <div style={styles.form}>

              {/* NOMBRE */}

              <label style={styles.label}>
                Nombre
              </label>

              <input
                style={styles.input}
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre: e.target.value,
                  })
                }
              />

              {/* CORREO */}

              <label style={styles.label}>
                Correo electrónico
              </label>

              <input
                style={styles.input}
                placeholder="correo@ejemplo.com"
                type="email"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    correo: e.target.value,
                  })
                }
              />

              {/* EDAD */}

              <label style={styles.label}>
                Edad
              </label>

              <input
                style={styles.input}
                placeholder="Edad"
                type="number"
                min="1"
                value={formData.edad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    edad: e.target.value,
                  })
                }
              />

              {/* CONTRASEÑA */}

              {usuario?.rol ===
                "SUPER_ADMINISTRADOR" && (

                <>
                  <label style={styles.label}>
                    Contraseña
                  </label>

                  <input
                    style={styles.input}
                    placeholder={
                      modalMode === "edit"
                        ? "Dejar vacío para conservar"
                        : "Contraseña"
                    }
                    type="password"
                    value={formData.contrasena}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contrasena:
                          e.target.value,
                      })
                    }
                  />
                </>
              )}

              {/* ROL */}

              <label style={styles.label}>
                Rol
              </label>

              <select
                style={styles.input}
                value={formData.rol}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rol: e.target.value,
                  })
                }
              >

                {usuario?.rol ===
                  "SUPER_ADMINISTRADOR" && (

                  <option value="SUPER_ADMINISTRADOR">
                    Super Administrador
                  </option>

                )}

                <option value="ADMIN">
                  Administrador
                </option>

                <option value="ENCARGADO">
                  Encargado
                </option>

              </select>

            </div>

            {/* FOOTER */}

            <div style={styles.modalFooter}>

              <button
                style={styles.cancelButton}
                onClick={cerrarModal}
              >
                Cancelar
              </button>

              <button
                style={styles.saveButton}
                onClick={handleSave}
              >
                💾{" "}
                {modalMode === "create"
                  ? "Registrar"
                  : "Guardar cambios"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


/* =====================================================
   ESTILOS
===================================================== */

const styles = {

  container: {
    padding: "10px",
    minHeight: "100%",
    background: "#f8fafc",
  },

  /* ================= HEADER ================= */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "20px",
  },

  title: {
    margin: 0,
    color: "#1e293b",
    fontSize: "26px",
    fontWeight: "750",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg, #4c1d95, #7c3aed)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow:
      "0 6px 18px rgba(124,58,237,0.25)",
  },

  buttonIcon: {
    fontSize: "20px",
    lineHeight: 1,
  },

  /* ================= CARD ================= */

  card: {
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 4px 20px rgba(15,23,42,0.05)",
    overflow: "hidden",
  },

  /* ================= SEARCH ================= */

  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    gap: "20px",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "450px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    background: "#f8fafc",
    padding: "0 13px",
  },

  searchIcon: {
    fontSize: "15px",
    marginRight: "8px",
  },

  searchInput: {
    width: "100%",
    height: "42px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#334155",
    fontSize: "14px",
  },

  totalUsers: {
    color: "#64748b",
    fontSize: "13px",
  },

  /* ================= TABLE ================= */

  tableContainer: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },

  th: {
    padding: "14px 18px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    textAlign: "left",
    borderTop: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "15px 18px",
    color: "#334155",
    fontSize: "13px",
    borderBottom: "1px solid #f1f5f9",
  },

  tr: {
    transition: "background 0.2s ease",
  },

  nameContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "600",
    color: "#1e293b",
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #4c1d95, #7c3aed)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
  },

  /* ================= BADGES ================= */

  roleBadge: {
    display: "inline-flex",
    padding: "5px 9px",
    borderRadius: "7px",
    fontSize: "10px",
    fontWeight: "700",
  },

  superAdmin: {
    background: "#ede9fe",
    color: "#5b21b6",
  },

  admin: {
    background: "#ddd6fe",
    color: "#6d28d9",
  },

  encargado: {
    background: "#e0e7ff",
    color: "#4338ca",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },

  statusActive: {
    background: "#dcfce7",
    color: "#15803d",
  },

  statusInactive: {
    background: "#fee2e2",
    color: "#b91c1c",
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "currentColor",
  },

  /* ================= ACTIONS ================= */

  actions: {
    display: "flex",
    gap: "6px",
  },

  actionButton: {
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },

  editButton: {
    background: "#ede9fe",
  },

  disableButton: {
    background: "#fee2e2",
  },

  enableButton: {
    background: "#dcfce7",
  },

  deleteButton: {
    background: "#fee2e2",
  },

  /* ================= EMPTY ================= */

  empty: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "30px",
    marginBottom: "10px",
  },

  /* ================= MODAL ================= */

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.55)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "20px",
  },

  modal: {
    width: "100%",
    maxWidth: "470px",
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow:
      "0 25px 60px rgba(15,23,42,0.25)",
    overflow: "hidden",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "22px 24px",
    borderBottom: "1px solid #e5e7eb",
  },

  modalTitle: {
    margin: 0,
    color: "#1e293b",
    fontSize: "20px",
    fontWeight: "700",
  },

  modalSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  closeButton: {
    width: "32px",
    height: "32px",
    border: "none",
    borderRadius: "8px",
    background: "#f1f5f9",
    color: "#64748b",
    fontSize: "22px",
    cursor: "pointer",
  },

  form: {
    padding: "22px 24px 5px",
  },

  label: {
    display: "block",
    marginBottom: "6px",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 13px",
    marginBottom: "15px",
    border: "1px solid #dbe2ea",
    borderRadius: "9px",
    outline: "none",
    background: "#ffffff",
    color: "#334155",
    fontSize: "14px",
  },

  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    padding: "18px 24px 22px",
    borderTop: "1px solid #f1f5f9",
  },

  cancelButton: {
    padding: "10px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#475569",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  saveButton: {
    padding: "10px 17px",
    border: "none",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg, #4c1d95, #7c3aed)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    boxShadow:
      "0 5px 15px rgba(124,58,237,0.2)",
  },
};

export default UsuariosPage;