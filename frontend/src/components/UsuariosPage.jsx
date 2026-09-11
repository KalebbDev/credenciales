import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const fetchUsuarios = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        throw new Error(
          "No fue posible cambiar el estatus"
        );
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
    const nombre =
      u.nombre?.toLowerCase() || "";

    const correo =
      u.correo?.toLowerCase() || "";

    const texto =
      search.trim().toLowerCase();

    return (
      nombre.includes(texto) ||
      correo.includes(texto)
    );
  });

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div style={styles.page}>
      {/* =====================================================
          ENCABEZADO
      ====================================================== */}

      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>
            <i className="bi bi-people-fill"></i>
          </div>

          <div>
            <h1 style={styles.title}>
              Administración de Usuarios
            </h1>

            <p style={styles.subtitle}>
              Control y administración de usuarios del sistema
            </p>
          </div>
        </div>

        <button
          type="button"
          style={styles.addButton}
          onClick={registrarUsuario}
        >
          <i className="bi bi-person-plus-fill"></i>
          Registrar Usuario
        </button>
      </div>

      {/* =====================================================
          TARJETA PRINCIPAL
      ====================================================== */}

      <div style={styles.mainCard}>
        {/* =================================================
            TOOLBAR
        ================================================== */}

        <div style={styles.toolbar}>
          <div>
            <h2 style={styles.sectionTitle}>
              Listado de usuarios
            </h2>

            <span style={styles.resultText}>
              {usuariosFiltrados.length} usuario
              {usuariosFiltrados.length !== 1
                ? "s"
                : ""}{" "}
            
              
            </span>
          </div>

          {/* BUSCADOR */}

          <div style={styles.searchContainer}>
            <i
              className="bi bi-search"
              style={styles.searchIcon}
            ></i>

            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={styles.searchInput}
              aria-label="Buscar usuario"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={styles.clearSearch}
                title="Limpiar búsqueda"
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            TABLA
        ================================================== */}

        <div style={styles.tableContainer}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div
                className="spinner-border"
                role="status"
                style={{
                  color: "#7c3aed",
                  width: "3rem",
                  height: "3rem",
                }}
              ></div>

              <p style={styles.loadingText}>
                Cargando usuarios...
              </p>
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div style={styles.emptyContainer}>
              <div style={styles.emptyIcon}>
                <i className="bi bi-person-x"></i>
              </div>

              <h4 style={styles.emptyTitle}>
                No se encontraron usuarios
              </h4>

              <p style={styles.emptyText}>
                {search
                  ? "No existe ningún usuario que coincida con la búsqueda."
                  : "Todavía no existen usuarios registrados."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  style={styles.clearButton}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>
                      NOMBRE
                    </th>

                    <th style={styles.th}>
                      CORREO
                    </th>

                    <th style={styles.thCenter}>
                      EDAD
                    </th>

                    <th style={styles.thCenter}>
                      ROL
                    </th>

                    <th style={styles.thCenter}>
                      ESTATUS
                    </th>

                    <th style={styles.thCenter}>
                      ACCIONES
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {usuariosFiltrados.map(
                    (u) => (
                      <tr
                        key={u._id}
                        style={styles.tableRow}
                      >
                        {/* NOMBRE */}

                        <td style={styles.td}>
                          <div
                            style={
                              styles.personContainer
                            }
                          >
                            
                            <div>
                              <div
                                style={
                                  styles.personName
                                }
                              >
                                {u.nombre ||
                                  "Sin nombre"}
                              </div>

                              
                            </div>
                          </div>
                        </td>

                        {/* CORREO */}
                        <td style={styles.td}>
                          <div
              
                          >
                           
                            <span>
                              {u.correo ||
                                "Sin correo"}
                            </span>
                          </div>
                        </td>

                        {/* EDAD */}
                        <td style={styles.tdCenter}>
                          <span>
                            

                            {u.edad || "N/A"}
                          </span>
                        </td>

                        {/* ROL */}

                        <td style={styles.tdCenter}>
                          <span
                            style={{
                              ...styles.roleBadge,

                              ...(u.rol ===
                              "SUPER_ADMINISTRADOR"
                                ? styles.superAdmin
                                : u.rol ===
                                  "ADMIN"
                                ? styles.admin
                                : styles.encargado),
                            }}
                          >
                            <i
                              className={
                                u.rol ===
                                "SUPER_ADMINISTRADOR"
                                  ? "bi bi-shield-lock-fill me-1"
                                  : u.rol ===
                                    "ADMIN"
                                  ? "bi bi-shield-check me-1"
                                  : "bi bi-person-workspace me-1"
                              }
                            ></i>

                            {u.rol}
                          </span>
                        </td>

                        {/* ESTATUS */}

                        <td style={styles.tdCenter}>
                          <span
                            style={{
                              ...styles.statusBadge,

                              ...(u.clave_estatus ===
                              1
                                ? styles.statusActive
                                : styles.statusInactive),
                            }}
                          >
                            {u.clave_estatus ===
                            1
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </td>

                        {/* ACCIONES */}

                        <td style={styles.tdCenter}>
                          <div
                            style={
                              styles.actions
                            }
                          >
                            {/* EDITAR */}

                            <button
                              type="button"
                              style={{
                                ...styles.actionButton,
                                ...styles.editButton,
                              }}
                              onClick={() =>
                                editarUsuario(u)
                              }
                              title="Editar usuario"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>

                            {/* ESTATUS */}

                            <button
                              type="button"
                              style={{
                                ...styles.actionButton,

                                ...(u.clave_estatus ===
                                1
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
                                u.clave_estatus ===
                                1
                                  ? "Deshabilitar usuario"
                                  : "Habilitar usuario"
                              }
                            >
                              <i
                                className={
                                  u.clave_estatus ===
                                  1
                                    ? "bi bi-person-slash"
                                    : "bi bi-person-check-fill"
                                }
                              ></i>
                            </button>

                            {/* ELIMINAR */}

                            {usuario?.rol ===
                              "SUPER_ADMINISTRADOR" && (
                              <button
                                type="button"
                                style={{
                                  ...styles.actionButton,
                                  ...styles.deleteButton,
                                }}
                                onClick={() =>
                                  eliminarUsuario(
                                    u._id
                                  )
                                }
                                title="Eliminar usuario"
                              >
                                <i className="bi bi-trash3-fill"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          MODAL
      ====================================================== */}

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {/* =================================================
                HEADER MODAL
            ================================================== */}

            <div style={styles.modalHeader}>
              <div
                style={
                  styles.modalTitleContainer
                }
              >
                <div
                  style={{
                    ...styles.modalIcon,

                    ...(modalMode ===
                    "create"
                      ? styles.modalIconCreate
                      : styles.modalIconEdit),
                  }}
                >
                  <i
                    className={
                      modalMode ===
                      "create"
                        ? "bi bi-person-plus-fill"
                        : "bi bi-person-gear"
                    }
                  ></i>
                </div>

                <div>
                  <h3
                    style={
                      styles.modalTitle
                    }
                  >
                    {modalMode ===
                    "create"
                      ? "Registrar Usuario"
                      : "Editar Usuario"}
                  </h3>

                  <p
                    style={
                      styles.modalSubtitle
                    }
                  >
                    {modalMode ===
                    "create"
                      ? "Ingresa los datos del nuevo usuario."
                      : " "}
                  </p>
                </div>
              </div>

              <button
                type="button"
                style={styles.closeButton}
                onClick={cerrarModal}
                title="Cerrar"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* =================================================
                FORMULARIO
            ================================================== */}

            <div style={styles.form}>
              {/* NOMBRE */}

              <div style={styles.formGroup}>
                <label
                  style={styles.label}
                >
                  Nombre
                </label>

                <div
                  style={
                    styles.inputContainer
                  }
                >
                  <i
                    className="bi bi-person-fill"
                    style={{
                      ...styles.inputIcon,
                      color: "#0f766e",
                    }}
                  ></i>

                  <input
                    style={styles.input}
                    placeholder="Nombre completo"
                    value={
                      formData.nombre
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombre:
                          e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* CORREO */}

              <div style={styles.formGroup}>
                <label
                  style={styles.label}
                >
                  Correo electrónico
                </label>

                <div
                  style={
                    styles.inputContainer
                  }
                >
                  <i
                    className="bi bi-envelope-fill"
                    style={{
                      ...styles.inputIcon,
                      color: "#2563eb",
                    }}
                  ></i>

                  <input
                    style={styles.input}
                    placeholder="correo@ejemplo.com"
                    type="email"
                    value={
                      formData.correo
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        correo:
                          e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* EDAD */}

              <div style={styles.formGroup}>
                <label
                  style={styles.label}
                >
                  Edad
                </label>

                <div
                  style={
                    styles.inputContainer
                  }
                >
                  <i
                    className="bi bi-calendar3"
                    style={{
                      ...styles.inputIcon,
                      color: "#d97706",
                    }}
                  ></i>

                  <input
                    style={styles.input}
                    placeholder="Edad"
                    type="number"
                    min="1"
                    value={formData.edad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        edad:
                          e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* CONTRASEÑA */}

              {usuario?.rol ===
                "SUPER_ADMINISTRADOR" && (
                <div
                  style={
                    styles.formGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Contraseña
                  </label>

                  <div
                    style={
                      styles.inputContainer
                    }
                  >
                    <i
                      className="bi bi-lock-fill"
                      style={{
                        ...styles.inputIcon,
                        color: "#dc2626",
                      }}
                    ></i>

                    <input
                      style={
                        styles.input
                      }
                      placeholder={
                        modalMode ===
                        "edit"
                          ? "Dejar vacío para conservar"
                          : "Contraseña"
                      }
                      type="password"
                      value={
                        formData.contrasena
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contrasena:
                            e.target
                              .value,
                        })
                      }
                    />
                  </div>

                  {modalMode ===
                    "edit" && (
                    <span
                      style={
                        styles.helperText
                      }
                    >
                      <i className="bi bi-info-circle me-1"></i>
                      Si no deseas cambiar la contraseña,
                      deja este campo vacío.
                    </span>
                  )}
                </div>
              )}

              {/* ROL */}

              <div style={styles.formGroup}>
                <label
                  style={styles.label}
                >
                  Rol
                </label>

                <div
                  style={
                    styles.inputContainer
                  }
                >
                  <i
                    className="bi bi-shield-check"
                    style={{
                      ...styles.inputIcon,
                      color: "#7c3aed",
                    }}
                  ></i>

                  <select
                    style={{
                      ...styles.input,
                      cursor: "pointer",
                    }}
                    value={formData.rol}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rol:
                          e.target.value,
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
              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div style={styles.modalFooter}>
              <button
                type="button"
                style={
                  styles.cancelButton
                }
                onClick={cerrarModal}
              >
                <i className="bi bi-x-lg me-2"></i>
                Cancelar
              </button>

              <button
                type="button"
                style={styles.saveButton}
                onClick={handleSave}
              >
                <i
                  className={
                    modalMode ===
                    "create"
                      ? "bi bi-person-plus-fill me-2"
                      : "bi bi-check-circle-fill me-2"
                  }
                ></i>

                {modalMode ===
                "create"
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
  /* =================================================
     PÁGINA
  ================================================== */

  page: {
    minHeight: "100vh",
    background: "#f8f7ff",
    padding: "30px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  /* =================================================
     HEADER
  ================================================== */

  header: {
    background:
      "linear-gradient(135deg, #4c1d95 0%, #7c3aed 55%, #a78bfa 100%)",
    borderRadius: "20px",
    padding: "26px 30px",
    color: "#fff",
    marginBottom: "24px",

    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",

    boxShadow:
      "0 12px 30px rgba(76,29,149,0.18)",
  },

  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  headerIcon: {
    width: "58px",
    height: "58px",
    minWidth: "58px",

    borderRadius: "16px",

    background:
      "rgba(255,255,255,0.18)",

    border:
      "1px solid rgba(255,255,255,0.20)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "27px",

    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.15)",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
  },

  subtitle: {
    margin: "6px 0 0",
    opacity: 0.85,
    fontSize: "14px",
  },

  addButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",

    padding: "11px 17px",

    border: "1px solid rgba(255,255,255,0.30)",
    borderRadius: "11px",

    background:
      "rgba(255,255,255,0.17)",

    backdropFilter:
      "blur(5px)",

    color: "#fff",

    cursor: "pointer",

    fontSize: "13px",
    fontWeight: "600",

    boxShadow:
      "0 5px 14px rgba(49,46,129,0.18)",
  },

  /* =================================================
     MAIN CARD
  ================================================== */

  mainCard: {
    background: "#ffffff",

    borderRadius: "20px",

    border:
      "1px solid #eeeaff",

    boxShadow:
      "0 8px 30px rgba(30,27,75,0.07)",

    overflow: "hidden",
  },

  /* =================================================
     TOOLBAR
  ================================================== */

  toolbar: {
    padding: "22px 24px",

    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",

    gap: "20px",
    flexWrap: "wrap",

    borderBottom:
      "1px solid #f1eff8",
  },

  sectionTitle: {
    margin: 0,

    color: "#312e81",

    fontSize: "18px",
    fontWeight: "700",
  },

  resultText: {
    display: "block",

    color: "#94a3b8",

    fontSize: "12px",

    marginTop: "4px",
  },

  /* =================================================
     BUSCADOR
  ================================================== */

  searchContainer: {
    position: "relative",

    width:
      "min(430px, 100%)",
  },

  searchIcon: {
    position: "absolute",

    left: "15px",
    top: "50%",

    transform:
      "translateY(-50%)",

    color: "#2563eb",

    fontSize: "16px",

    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",

    boxSizing: "border-box",

    padding:
      "12px 42px 12px 43px",

    border:
      "1px solid #dbe2ea",

    borderRadius: "12px",

    outline: "none",

    color: "#334155",

    background: "#ffffff",

    fontSize: "13px",

    boxShadow:
      "0 2px 8px rgba(15,23,42,0.04)",
  },

  clearSearch: {
    position: "absolute",

    right: "12px",
    top: "50%",

    transform:
      "translateY(-50%)",

    border: "none",

    background:
      "transparent",

    color: "#94a3b8",

    cursor: "pointer",

    fontSize: "15px",
  },

  /* =================================================
     TABLA
  ================================================== */

  tableContainer: {
    width: "100%",
  },

  table: {
    width: "100%",

    borderCollapse:
      "collapse",

    minWidth: "850px",
  },

  th: {
    padding: "15px 20px",

    textAlign: "left",

    fontSize: "11px",

    fontWeight: "700",

    color: "#64748b",

    background: "#faf9ff",

    borderBottom:
      "1px solid #eeeaff",

    letterSpacing: "0.5px",
  },

  thCenter: {
    padding: "15px 20px",

    textAlign: "center",

    fontSize: "11px",

    fontWeight: "700",

    color: "#64748b",

    background: "#faf9ff",

    borderBottom:
      "1px solid #eeeaff",

    letterSpacing: "0.5px",
  },

  tableRow: {
    borderBottom:
      "1px solid #f1f5f9",

    transition:
      "background 0.2s ease",
  },

  td: {
    padding: "16px 20px",

    color: "#334155",

    fontSize: "13px",

    verticalAlign:
      "middle",
  },

  tdCenter: {
    padding: "16px 20px",

    color: "#334155",

    fontSize: "13px",

    textAlign: "center",

    verticalAlign:
      "middle",
  },

  /* =================================================
     USUARIO
  ================================================== */

  personContainer: {
    display: "flex",

    alignItems: "center",

    gap: "12px",
  },

  avatar: {
    width: "42px",
    height: "42px",

    minWidth: "42px",

    borderRadius: "12px",

    background:
      "linear-gradient(135deg, #0f766e, #38bdf8)",

    color: "#fff",

    display: "flex",

    alignItems: "center",

    justifyContent:
      "center",

    fontSize: "13px",

    fontWeight: "700",
  },

  personName: {
    fontWeight: "600",

    color: "#1e1b4b",

    marginBottom: "3px",
  },

  personSubtitle: {
    color: "#94a3b8",

    fontSize: "11px",
  },

  emailContainer: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    color: "#475569",
  },

  ageBadge: {
    display: "inline-flex",

    alignItems: "center",

    padding: "6px 10px",

    borderRadius: "8px",

    background: "#fff7ed",

    color: "#c2410c",

    fontSize: "11px",

    fontWeight: "600",
  },

  /* =================================================
     ROLES
  ================================================== */

  roleBadge: {
    display:
      "inline-flex",

    alignItems: "center",

    padding: "6px 9px",

    borderRadius: "8px",

    fontSize: "10px",

    fontWeight: "700",
  },

  superAdmin: {
    background:
      "#ede9fe",

    color: "#5b21b6",
  },

  admin: {
    background:
      "#dbeafe",

    color: "#1d4ed8",
  },

  encargado: {
    background:
      "#fef3c7",

    color: "#b45309",
  },

  /* =================================================
     ESTATUS
  ================================================== */

  statusBadge: {
    display:
      "inline-flex",

    alignItems: "center",

    gap: "6px",

    padding: "6px 10px",

    borderRadius: "20px",

    fontSize: "11px",

    fontWeight: "600",
  },

  statusActive: {
    background:
      "#dcfce7",

    color: "#15803d",
  },

  statusInactive: {
    background:
      "#fee2e2",

    color: "#b91c1c",
  },

  statusDot: {
    width: "6px",
    height: "6px",

    borderRadius: "50%",

    background:
      "currentColor",
  },

  /* =================================================
     ACCIONES
  ================================================== */

  actions: {
    display: "flex",

    justifyContent:
      "center",

    gap: "7px",
  },

  actionButton: {
    width: "34px",
    height: "34px",

    border: "none",

    borderRadius: "9px",

    cursor: "pointer",

    display:
      "inline-flex",

    alignItems: "center",

    justifyContent:
      "center",

    fontSize: "14px",

    transition:
      "all 0.2s ease",
  },

  editButton: {
    background:
      "#dbeafe",

    color: "#2563eb",
  },

  disableButton: {
    background:
      "#ffedd5",

    color: "#ea580c",
  },

  enableButton: {
    background:
      "#dcfce7",

    color: "#15803d",
  },

  deleteButton: {
    background:
      "#fee2e2",

    color: "#dc2626",
  },

  /* =================================================
     LOADING
  ================================================== */

  loadingContainer: {
    padding:
      "80px 20px",

    textAlign: "center",
  },

  loadingText: {
    marginTop: "15px",

    color: "#64748b",

    fontSize: "14px",
  },

  /* =================================================
     EMPTY
  ================================================== */

  emptyContainer: {
    padding:
      "70px 20px",

    textAlign: "center",
  },

  emptyIcon: {
    width: "70px",
    height: "70px",

    margin:
      "0 auto 15px",

    borderRadius: "20px",

    background:
      "#f5f3ff",

    color: "#8b5cf6",

    display: "flex",

    alignItems: "center",

    justifyContent:
      "center",

    fontSize: "30px",
  },

  emptyTitle: {
    color: "#312e81",

    margin:
      "0 0 7px",
  },

  emptyText: {
    color: "#94a3b8",

    fontSize: "13px",

    marginBottom: "18px",
  },

  clearButton: {
    border: "none",

    background:
      "#7c3aed",

    color: "#fff",

    padding:
      "9px 15px",

    borderRadius: "9px",

    cursor: "pointer",
  },

  /* =================================================
     MODAL
  ================================================== */

  modalOverlay: {
    position: "fixed",

    inset: 0,

    background:
      "rgba(15,23,42,0.65)",

    backdropFilter:
      "blur(5px)",

    display: "flex",

    justifyContent:
      "center",

    alignItems: "center",

    padding: "20px",

    zIndex: 9999,
  },

  modal: {
    width:
      "min(620px, 100%)",

    maxHeight: "92vh",

    background: "#fff",

    borderRadius: "20px",

    boxShadow:
      "0 25px 70px rgba(15,23,42,0.25)",

    overflowY: "auto",
  },

  modalHeader: {
    padding:
      "18px 22px",

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    borderBottom:
      "1px solid #eeeaff",
  },

  modalTitleContainer: {
    display: "flex",

    alignItems: "center",

    gap: "12px",
  },

  modalIcon: {
    width: "44px",
    height: "44px",

    borderRadius: "12px",

    display: "flex",

    alignItems: "center",

    justifyContent:
      "center",

    fontSize: "20px",
  },

  modalIconCreate: {
    background:
      "#dcfce7",

    color: "#15803d",
  },

  modalIconEdit: {
    background:
      "#dbeafe",

    color: "#2563eb",
  },

  modalTitle: {
    margin: 0,

    fontSize: "17px",

    fontWeight: "700",

    color: "#312e81",
  },

  modalSubtitle: {
    margin:
      "3px 0 0",

    color: "#94a3b8",

    fontSize: "12px",
  },

  closeButton: {
    width: "36px",
    height: "36px",

    border: "none",

    borderRadius: "9px",

    background:
      "#fee2e2",

    color: "#dc2626",

    cursor: "pointer",
  },

  /* =================================================
     FORMULARIO
  ================================================== */

  form: {
    padding:
      "24px 24px 8px",
  },

  formGroup: {
    marginBottom: "17px",
  },

  label: {
    display: "block",

    marginBottom: "7px",

    color: "#334155",

    fontSize: "13px",

    fontWeight: "600",
  },

  inputContainer: {
    position: "relative",

    width: "100%",
  },

  inputIcon: {
    position: "absolute",

    left: "14px",

    top: "50%",

    transform:
      "translateY(-50%)",

    fontSize: "15px",

    pointerEvents: "none",
  },

  input: {
    width: "100%",

    boxSizing: "border-box",

    padding:
      "11px 13px 11px 42px",

    border:
      "1px solid #dbe2ea",

    borderRadius: "10px",

    outline: "none",

    background: "#ffffff",

    color: "#334155",

    fontSize: "14px",

    boxShadow:
      "0 2px 7px rgba(15,23,42,0.03)",
  },

  helperText: {
    display: "block",

    marginTop: "6px",

    color: "#94a3b8",

    fontSize: "11px",
  },

  /* =================================================
     MODAL FOOTER
  ================================================== */

  modalFooter: {
    display: "flex",

    justifyContent:
      "flex-end",

    gap: "10px",

    padding:
      "16px 24px 22px",

    borderTop:
      "1px solid #f1f5f9",

    background:
      "#fafaff",
  },

  cancelButton: {
    padding:
      "10px 16px",

    border: "none",

    borderRadius: "9px",

    background:
      "#fee2e2",

    color: "#dc2626",

    cursor: "pointer",

    fontSize: "13px",

    fontWeight: "600",
  },

  saveButton: {
    padding:
      "10px 17px",

    border: "none",

    borderRadius: "9px",

    background:
      "#16a34a",

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "13px",

    fontWeight: "600",

    boxShadow:
      "0 5px 15px rgba(22,163,74,0.20)",
  },
};

export default UsuariosPage;