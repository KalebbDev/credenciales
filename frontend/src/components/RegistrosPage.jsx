import React, { useState, useEffect } from "react";
import LicenciaForm from "./LicenciaForm";
import LicenciaPage from "./LicenciaPage";
import DatosPersonalesForm from "./DatosPersonalesForm";

function RegistrosPage() {
  const [ciudadanos, setCiudadanos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [selectedCiudadano, setSelectedCiudadano] = useState(null);
  const [selectedLicencia, setSelectedLicencia] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // CARGAR CIUDADANOS
  // ==========================================================
  useEffect(() => {
    const fetchCiudadanos = async () => {
      const token = localStorage.getItem("token");

      try {
        setLoading(true);

        const res = await fetch(
          "http://localhost:3020/api/v1/ciudadanos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setCiudadanos(data || []);
      } catch (err) {
        console.error("Error al cargar ciudadanos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCiudadanos();
  }, []);

  // ==========================================================
  // CERRAR MODAL
  // ==========================================================
  const cerrarModal = () => {
    setShowModal(false);
    setModalMode("");
    setSelectedCiudadano(null);
    setSelectedLicencia(null);
  };

  // ==========================================================
  // EDITAR CIUDADANO
  // ==========================================================
  const editarCiudadano = (ciudadano) => {
    setSelectedCiudadano(ciudadano);
    setModalMode("editarCiudadano");
    setShowModal(true);
  };

  // ==========================================================
  // AGREGAR LICENCIA
  // ==========================================================
  const agregarLicencia = (ciudadano) => {
    setSelectedCiudadano(ciudadano);
    setModalMode("licencia");
    setShowModal(true);
  };

  // ==========================================================
  // VER CIUDADANO
  // ==========================================================
  const verCiudadano = (ciudadano) => {
    setSelectedCiudadano(ciudadano);
    setModalMode("ver");
    setShowModal(true);
  };

  // ==========================================================
  // PREVIEW LICENCIA
  // ==========================================================
  const previewLicencia = (ciudadano, licencia) => {
    setSelectedCiudadano(ciudadano);
    setSelectedLicencia(licencia);
    setModalMode("previewLicencia");
  };

  
  // ==========================================================
  // FILTRO
  // ==========================================================
  const ciudadanosFiltrados = ciudadanos.filter((c) => {
    const nombre = `${c.datosPersonales?.nombre || ""} ${
      c.datosPersonales?.apellidoPaterno || ""
    } ${c.datosPersonales?.apellidoMaterno || ""}`.toLowerCase();

    const curp = (
      c.datosPersonales?.curp || ""
    ).toLowerCase();

    const telefono = (
      c.datosPersonales?.telefono || ""
    ).toLowerCase();

    const texto = search.toLowerCase();

    return (
      nombre.includes(texto) ||
      curp.includes(texto) ||
      telefono.includes(texto)
    );
  });

  // ==========================================================
  // INICIALES
  // ==========================================================
  const obtenerIniciales = (ciudadano) => {
    const nombre =
      ciudadano.datosPersonales?.nombre?.charAt(0) || "";

    const apellido =
      ciudadano.datosPersonales?.apellidoPaterno?.charAt(0) || "";

    return `${nombre}${apellido}`.toUpperCase();
  };

  // ==========================================================
  // NOMBRE COMPLETO
  // ==========================================================
  const obtenerNombreCompleto = (ciudadano) => {
    return [
      ciudadano.datosPersonales?.nombre,
      ciudadano.datosPersonales?.apellidoPaterno,
      ciudadano.datosPersonales?.apellidoMaterno,
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div style={styles.page}>

      {/* ======================================================
          ENCABEZADO
      ======================================================= */}
      <div style={styles.header}>
        <div>
         

          <div>
            <h1 style={styles.title}>
              Registros de Ciudadanos
            </h1>

            <p style={styles.subtitle}>
              Administración y control de ciudadanos y licencias
            </p>
          </div>
        </div>
      </div>

      

      {/* ======================================================
          CONTENEDOR PRINCIPAL
      ======================================================= */}
      <div style={styles.mainCard}>

        {/* BARRA SUPERIOR */}
        <div style={styles.toolbar}>

          <div>
            <h3 style={styles.sectionTitle}>
              <i className="bi bi-table me-2"></i>
              Lista de ciudadanos
            </h3>

            <span style={styles.resultText}>
              {ciudadanosFiltrados.length} registro
              {ciudadanosFiltrados.length !== 1 ? "s" : ""}
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
             
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
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

        {/* ====================================================
            TABLA
        ===================================================== */}
        <div style={styles.tableWrapper}>

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
                Cargando ciudadanos...
              </p>
            </div>
          ) : ciudadanosFiltrados.length === 0 ? (

            /* =================================================
               SIN RESULTADOS
            ================================================== */
            <div style={styles.emptyContainer}>

              <div style={styles.emptyIcon}>
                <i className="bi bi-person-x"></i>
              </div>

              <h4 style={styles.emptyTitle}>
                No se encontraron registros
              </h4>

              <p style={styles.emptyText}>
                {search
                  ? "No existe ningún ciudadano que coincida con la búsqueda."
                  : "Todavía no hay ciudadanos registrados."}
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
                    <th style={styles.th}>CIUDADANO</th>
                    <th style={styles.th}>CURP</th>
                    <th style={styles.th}>TELÉFONO</th>
                    <th style={styles.thCenter}>LICENCIAS</th>
                    <th style={styles.thCenter}>ACCIONES</th>
                  </tr>
                </thead>

                <tbody>

                  {ciudadanosFiltrados.map((c) => {

                    const nombre =
                      obtenerNombreCompleto(c);

                    const totalLicencias =
                      c.licencias?.length || 0;

                    return (
                      <tr
                        key={c._id}
                        style={styles.tableRow}
                      >

                        {/* CIUDADANO */}
                        <td style={styles.td}>

                          <div style={styles.personContainer}>

                            <div style={styles.avatar}>
                              {obtenerIniciales(c)}
                            </div>

                            <div>
                              <div style={styles.personName}>
                                {nombre || "Sin nombre"}
                              </div>

                              <div style={styles.personId}>
                                <i className="bi bi-person-badge me-1"></i>
                                Ciudadano registrado
                              </div>
                            </div>

                          </div>

                        </td>

                        {/* CURP */}
                        <td style={styles.td}>

                          <span style={styles.curpBadge}>
                            {c.datosPersonales?.curp || "N/A"}
                          </span>

                        </td>

                        {/* TELÉFONO */}
                        <td style={styles.td}>

                          <div style={styles.phone}>
                            <i className="bi bi-telephone me-2"></i>
                            {c.datosPersonales?.telefono || "N/A"}
                          </div>

                        </td>

                        {/* LICENCIAS */}
                        <td style={styles.tdCenter}>

                          <span
                            style={
                              totalLicencias > 0
                                ? styles.licenseBadge
                                : styles.noLicenseBadge
                            }
                          >

                            <i
                              className={
                                totalLicencias > 0
                                  ? "bi bi-card-checklist me-1"
                                  : "bi bi-card-text me-1"
                              }
                            ></i>

                            {totalLicencias}

                          </span>

                        </td>

                        {/* ACCIONES */}
                        <td style={styles.tdCenter}>

                          <div style={styles.actions}>

                            <button
                              type="button"
                              style={{
                                ...styles.actionButton,
                                ...styles.viewButton,
                              }}
                              onClick={() =>
                                verCiudadano(c)
                              }
                              title="Ver ciudadano"
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                            <button
                              type="button"
                              style={{
                                ...styles.actionButton,
                                ...styles.editButton,
                              }}
                              onClick={() =>
                                editarCiudadano(c)
                              }
                              title="Editar ciudadano"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>

                            <button
                              type="button"
                              style={{
                                ...styles.actionButton,
                                ...styles.licenseButton,
                              }}
                              onClick={() =>
                                agregarLicencia(c)
                              }
                              title="Agregar licencia"
                            >
                              <i className="bi bi-plus-lg"></i>
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* ======================================================
          MODAL
      ======================================================= */}
      {showModal && (
        <div style={styles.modalOverlay}>

          <div
            style={{
              ...styles.modal,
              ...(modalMode === "previewLicencia"
                ? styles.largeModal
                : {}),
            }}
          >

            {/* ==================================================
                MODAL HEADER
            =================================================== */}
            <div style={styles.modalHeader}>

              <div style={styles.modalTitleContainer}>

                <div style={styles.modalIcon}>
                  <i
                    className={
                      modalMode === "licencia"
                        ? "bi bi-card-heading"
                        : modalMode === "editarCiudadano"
                        ? "bi bi-person-gear"
                        : modalMode === "previewLicencia"
                        ? "bi bi-credit-card-2-front"
                        : "bi bi-person-vcard"
                    }
                  ></i>
                </div>

                <div>

                  <h3 style={styles.modalTitle}>

                    {modalMode === "editarCiudadano" &&
                      "Editar ciudadano"}

                    {modalMode === "licencia" &&
                      "Nueva licencia"}

                    {modalMode === "ver" &&
                      "Información del ciudadano"}

                    {modalMode === "previewLicencia" &&
                      "Vista previa de licencia"}

                  </h3>

                  {selectedCiudadano && (
                    <span style={styles.modalSubtitle}>
                      {obtenerNombreCompleto(
                        selectedCiudadano
                      )}
                    </span>
                  )}

                </div>

              </div>

              <button
                type="button"
                onClick={cerrarModal}
                style={styles.closeButton}
                title="Cerrar"
              >
                <i className="bi bi-x-lg"></i>
              </button>

            </div>

            {/* ==================================================
                MODAL BODY
            =================================================== */}
            <div style={styles.modalBody}>

              {/* EDITAR CIUDADANO */}
              {modalMode === "editarCiudadano" && (
                <DatosPersonalesForm
                  ciudadano={selectedCiudadano}
                  onSaved={() => {
                    cerrarModal();
                  }}
                />
              )}

              {/* AGREGAR LICENCIA */}
              {modalMode === "licencia" && (
                <LicenciaForm
                  ciudadanoId={
                    selectedCiudadano?._id
                  }
                  setShowLicencia={() =>
                    setShowModal(false)
                  }
                />
              )}

              {/* VER CIUDADANO */}
              {modalMode === "ver" && (
                <div>

                  {/* INFORMACIÓN DEL CIUDADANO */}
                  <div style={styles.infoCard}>

                    <div style={styles.infoAvatar}>
                      {obtenerIniciales(
                        selectedCiudadano
                      )}
                    </div>

                    <div style={{ flex: 1 }}>

                      <h4 style={styles.infoName}>
                        {obtenerNombreCompleto(
                          selectedCiudadano
                        )}
                      </h4>

                      <div style={styles.infoGrid}>

                        <div>
                          <span style={styles.infoLabel}>
                            CURP
                          </span>

                          <span style={styles.infoValue}>
                            {selectedCiudadano
                              ?.datosPersonales?.curp ||
                              "N/A"}
                          </span>
                        </div>

                        <div>
                          <span style={styles.infoLabel}>
                            Teléfono
                          </span>

                          <span style={styles.infoValue}>
                            {selectedCiudadano
                              ?.datosPersonales?.telefono ||
                              "N/A"}
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* LICENCIAS */}
                  <div style={styles.licensesHeader}>

                    <div>
                      <h4 style={styles.licensesTitle}>
                        <i className="bi bi-card-checklist me-2"></i>
                        Licencias registradas
                      </h4>

                      <span style={styles.resultText}>
                        {selectedCiudadano?.licencias
                          ?.length || 0} licencia
                        {selectedCiudadano?.licencias
                          ?.length !== 1
                          ? "s"
                          : ""}
                      </span>
                    </div>

                    <button
                      type="button"
                      style={styles.addLicenseSmall}
                      onClick={() =>
                        agregarLicencia(
                          selectedCiudadano
                        )
                      }
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      Nueva licencia
                    </button>

                  </div>

                  {/* LISTA LICENCIAS */}
                  {selectedCiudadano?.licencias
                    ?.length > 0 ? (

                    selectedCiudadano.licencias.map(
                      (lic, index) => (
                        <div
                          key={lic._id}
                          style={styles.licenciaCard}
                        >

                          <div style={styles.licenseNumber}>
                            {index + 1}
                          </div>

                          <div
                            style={{
                              flex: 1,
                              minWidth: 0,
                            }}
                          >

                            <div style={styles.licenseCardTitle}>
                              {lic.tipo || "Licencia"}{" "}
                              {lic.nombreTipo
                                ? `- ${lic.nombreTipo}`
                                : ""}
                            </div>

                            <div style={styles.licenseDetails}>

                              <span>
                                <i className="bi bi-upc-scan me-1"></i>
                                Folio:{" "}
                                <strong>
                                  {lic.folio || "N/A"}
                                </strong>
                              </span>

                              <span>
                                <i className="bi bi-credit-card me-1"></i>
                                Matrícula:{" "}
                                <strong>
                                  {lic.matricula ||
                                    "N/A"}
                                </strong>
                              </span>

                            </div>

                          </div>

                          <div style={styles.licenseActions}>

                            <button
                              type="button"
                              style={{
                                ...styles.actionButton,
                                ...styles.viewButton,
                              }}
                              onClick={() =>
                                previewLicencia(
                                  selectedCiudadano,
                                  lic
                                )
                              }
                              title="Ver licencia"
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                            <button
                              type="button"
                              style={{
                                ...styles.actionButton,
                                ...styles.editButton,
                              }}
                              title="Editar licencia"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>

                          </div>

                        </div>
                      )
                    )

                  ) : (

                    <div style={styles.noLicenses}>

                      <div style={styles.noLicensesIcon}>
                        <i className="bi bi-card-text"></i>
                      </div>

                      <strong>
                        Sin licencias registradas
                      </strong>

                      <span>
                        Este ciudadano todavía no tiene
                        licencias.
                      </span>

                    </div>

                  )}

                </div>
              )}

              {/* PREVIEW LICENCIA */}
              {modalMode === "previewLicencia" && (
                <div style={styles.previewContainer}>

                  <LicenciaPage
                    ciudadanoId={
                      selectedCiudadano?._id
                    }
                    licenciaId={
                      selectedLicencia?._id
                    }
                    setShowLicencia={() =>
                      setShowModal(false)
                    }
                  />

                </div>
              )}

            </div>

            {/* ==================================================
                MODAL FOOTER
            =================================================== */}
            {modalMode !== "previewLicencia" && (
              <div style={styles.modalFooter}>

                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={cerrarModal}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  Cerrar
                </button>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f7ff",
    padding: "30px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  // HEADER
  header: {
    background:
      "linear-gradient(135deg, #4c1d95 0%, #7c3aed 55%, #a78bfa 100%)",
    borderRadius: "20px",
    padding: "28px 32px",
    color: "#fff",
    marginBottom: "24px",
    boxShadow: "0 12px 30px rgba(76, 29, 149, 0.18)",
  },

  headerIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    marginBottom: "15px",
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

  // STATS
  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },

  statCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 5px 18px rgba(30, 27, 75, 0.06)",
    border: "1px solid #eeeaff",
  },

  statIconPurple: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "#ede9fe",
    color: "#6d28d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  statIconGreen: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  statIconOrange: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "#ffedd5",
    color: "#c2410c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  statLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    marginBottom: "4px",
  },

  statNumber: {
    display: "block",
    color: "#1e1b4b",
    fontSize: "25px",
    fontWeight: "700",
  },

  // MAIN
  mainCard: {
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(30, 27, 75, 0.07)",
    border: "1px solid #eeeaff",
    overflow: "hidden",
  },

  toolbar: {
    padding: "22px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    borderBottom: "1px solid #f1eff8",
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

  // SEARCH
  searchContainer: {
    position: "relative",
    width: "min(430px, 100%)",
  },

  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#8b5cf6",
    fontSize: "17px",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 42px 12px 43px",
    border: "1px solid #ddd6fe",
    borderRadius: "12px",
    outline: "none",
    color: "#334155",
    background: "#fafaff",
    fontSize: "13px",
  },

  clearSearch: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "15px",
  },

  // TABLE
  tableWrapper: {
    width: "100%",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "15px 20px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "700",
    color: "#64748b",
    background: "#faf9ff",
    borderBottom: "1px solid #eeeaff",
    letterSpacing: "0.5px",
  },

  thCenter: {
    padding: "15px 20px",
    textAlign: "center",
    fontSize: "11px",
    fontWeight: "700",
    color: "#64748b",
    background: "#faf9ff",
    borderBottom: "1px solid #eeeaff",
    letterSpacing: "0.5px",
  },

  tableRow: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background 0.2s ease",
  },

  td: {
    padding: "16px 20px",
    color: "#334155",
    fontSize: "13px",
    verticalAlign: "middle",
  },

  tdCenter: {
    padding: "16px 20px",
    color: "#334155",
    fontSize: "13px",
    textAlign: "center",
    verticalAlign: "middle",
  },

  // PERSONA
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
      "linear-gradient(135deg, #7c3aed, #a78bfa)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
  },

  personName: {
    fontWeight: "600",
    color: "#1e1b4b",
    marginBottom: "3px",
  },

  personId: {
    color: "#94a3b8",
    fontSize: "11px",
  },

  curpBadge: {
    display: "inline-block",
    padding: "6px 9px",
    background: "#f5f3ff",
    color: "#6d28d9",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.3px",
  },

  phone: {
    color: "#475569",
    whiteSpace: "nowrap",
  },

  licenseBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    background: "#dcfce7",
    color: "#15803d",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "12px",
  },

  noLicenseBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    background: "#f1f5f9",
    color: "#64748b",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "12px",
  },

  // ACTIONS
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "7px",
  },

  actionButton: {
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },

  viewButton: {
    background: "#ede9fe",
    color: "#6d28d9",
  },

  editButton: {
    background: "#dbeafe",
    color: "#2563eb",
  },

  licenseButton: {
    background: "#dcfce7",
    color: "#15803d",
  },

  // LOADING
  loadingContainer: {
    padding: "80px 20px",
    textAlign: "center",
  },

  loadingText: {
    marginTop: "15px",
    color: "#64748b",
    fontSize: "14px",
  },

  // EMPTY
  emptyContainer: {
    padding: "70px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 15px",
    borderRadius: "20px",
    background: "#f5f3ff",
    color: "#8b5cf6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
  },

  emptyTitle: {
    color: "#312e81",
    margin: "0 0 7px",
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "18px",
  },

  clearButton: {
    border: "none",
    background: "#7c3aed",
    color: "#fff",
    padding: "9px 15px",
    borderRadius: "9px",
    cursor: "pointer",
  },

  // MODAL
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 9999,
  },

  modal: {
    width: "min(850px, 100%)",
    maxHeight: "92vh",
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 25px 70px rgba(15, 23, 42, 0.25)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  largeModal: {
    width: "min(1200px, 100%)",
  },

  modalHeader: {
    padding: "18px 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eeeaff",
    background: "#fff",
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
    background: "#ede9fe",
    color: "#6d28d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color: "#312e81",
  },

  modalSubtitle: {
    display: "block",
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "3px",
  },

  closeButton: {
    width: "36px",
    height: "36px",
    border: "none",
    borderRadius: "9px",
    background: "#f1f5f9",
    color: "#64748b",
    cursor: "pointer",
  },

  modalBody: {
    padding: "24px",
    overflowY: "auto",
    flex: 1,
  },

  modalFooter: {
    padding: "15px 22px",
    borderTop: "1px solid #eeeaff",
    display: "flex",
    justifyContent: "flex-end",
    background: "#fafaff",
  },

  cancelButton: {
    border: "none",
    background: "#dc2626",
    color: "#fff",
    padding: "9px 16px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "500",
  },

  // INFO
  infoCard: {
    background:
      "linear-gradient(135deg, #f5f3ff, #faf9ff)",
    border: "1px solid #ddd6fe",
    borderRadius: "15px",
    padding: "18px",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    marginBottom: "25px",
  },

  infoAvatar: {
    width: "55px",
    height: "55px",
    minWidth: "55px",
    borderRadius: "15px",
    background:
      "linear-gradient(135deg, #4c1d95, #7c3aed)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  infoName: {
    margin: "0 0 12px",
    color: "#312e81",
    fontSize: "17px",
  },

  infoGrid: {
    display: "flex",
    gap: "35px",
    flexWrap: "wrap",
  },

  infoLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    textTransform: "uppercase",
    marginBottom: "3px",
  },

  infoValue: {
    display: "block",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "600",
  },

  // LICENSES
  licensesHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "15px",
  },

  licensesTitle: {
    margin: 0,
    color: "#312e81",
    fontSize: "16px",
  },

  addLicenseSmall: {
    border: "none",
    background: "#7c3aed",
    color: "#fff",
    padding: "9px 13px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
  },

  licenciaCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "15px",
    background: "#fff",
    border: "1px solid #e9e5ff",
    borderRadius: "13px",
    marginBottom: "10px",
    boxShadow: "0 3px 10px rgba(76,29,149,0.04)",
  },

  licenseNumber: {
    width: "35px",
    height: "35px",
    borderRadius: "10px",
    background: "#ede9fe",
    color: "#6d28d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "12px",
  },

  licenseCardTitle: {
    color: "#312e81",
    fontWeight: "700",
    fontSize: "13px",
    marginBottom: "5px",
  },

  licenseDetails: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    color: "#64748b",
    fontSize: "11px",
  },

  licenseActions: {
    display: "flex",
    gap: "6px",
  },

  noLicenses: {
    padding: "35px 20px",
    textAlign: "center",
    background: "#fafaff",
    border: "1px dashed #ddd6fe",
    borderRadius: "13px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#64748b",
    gap: "5px",
  },

  noLicensesIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background: "#ede9fe",
    color: "#8b5cf6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    marginBottom: "5px",
  },

  previewContainer: {
    width: "100%",
  },
};

export default RegistrosPage;