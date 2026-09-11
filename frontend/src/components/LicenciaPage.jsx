import React, { useEffect, useState } from "react";
import LicenciaPreview from "./LicenciaPreview";

function LicenciaPage({ ciudadanoId, setShowLicencia }) {
  const [ciudadano, setCiudadano] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // CARGAR CIUDADANO
  // ==========================================================
  useEffect(() => {
    const fetchCiudadano = async () => {
      const token = localStorage.getItem("token");

      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:3020/api/v1/ciudadanos/${ciudadanoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              "No se pudieron cargar los datos"
          );
        }

        setCiudadano(data);
      } catch (err) {
        console.error(
          "Error al cargar ciudadano:",
          err
        );

        setCiudadano(null);
      } finally {
        setLoading(false);
      }
    };

    if (ciudadanoId) {
      fetchCiudadano();
    }
  }, [ciudadanoId]);

  // ==========================================================
  // CARGANDO
  // ==========================================================
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div
            className="spinner-border"
            style={styles.spinner}
            role="status"
          ></div>

          <h3 style={styles.loadingTitle}>
            Cargando licencia
          </h3>

          <p style={styles.loadingText}>
            Estamos preparando la información
            registrada.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================
  if (!ciudadano) {
    return (
      <div style={styles.page}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIconContainer}>
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>

          <h3 style={styles.errorTitle}>
            No se pudieron cargar los datos
          </h3>

          <p style={styles.errorText}>
            Ocurrió un problema al obtener la
            información del ciudadano.
          </p>

          <button
            type="button"
            onClick={() =>
              setShowLicencia(false)
            }
            style={styles.backButton}
          >
            <i className="bi bi-arrow-left"></i>
            Regresar
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ÚLTIMA LICENCIA REGISTRADA
  // ==========================================================
  const licencia =
    ciudadano.licencias?.[
      ciudadano.licencias.length - 1
    ];

  const datosPersonales =
    ciudadano.datosPersonales || {};

  // ==========================================================
  // NOMBRE COMPLETO
  // ==========================================================
  const nombreCompleto = [
    datosPersonales.nombre,
    datosPersonales.apellidoPaterno,
    datosPersonales.apellidoMaterno,
  ]
    .filter(Boolean)
    .join(" ");

  // ==========================================================
  // FORMATEAR FECHA
  // ==========================================================
  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";

    return new Date(fecha).toLocaleDateString(
      "es-MX",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // ==========================================================
  // IMÁGENES
  // ==========================================================
  const fotografia =
    datosPersonales.fotografia
      ? `http://localhost:3020${datosPersonales.fotografia}`
      : "/placeholder.png";

  const firma = datosPersonales.firma
    ? `http://localhost:3020${datosPersonales.firma}`
    : "/firma.png";

  // ==========================================================
  // IMPRIMIR PDF
  // ==========================================================
  const imprimirLicencia = () => {
    const iframe = document.querySelector(
      "iframe[title='Licencia PDF']"
    );

    if (iframe) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } else {
      alert(
        "No se encontró la vista previa de la licencia."
      );
    }
  };

  return (
    <div style={styles.page}>
      {/* ======================================================
          ENCABEZADO
      ======================================================= */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>
            <i className="bi bi-card-checklist"></i>
          </div>

          <div>
            <h1 style={styles.title}>
              Licencia Registrada
            </h1>

            <p style={styles.subtitle}>
              Consulta la información del ciudadano
              y la vista previa de su licencia
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          CONTENIDO
      ======================================================= */}
      <div style={styles.content}>
        {/* ==================================================
            INFORMACIÓN PRINCIPAL
        =================================================== */}
        <div style={styles.mainCard}>
          <SectionHeader
            icon="bi bi-person-vcard-fill"
            title="Información personal"
            description="Datos principales del ciudadano registrado"
            iconStyle={styles.sectionIconBlue}
          />

          <div style={styles.profileContainer}>
            {/* FOTO */}
            <div style={styles.photoContainer}>
              <img
                src={fotografia}
                alt="Fotografía del ciudadano"
                style={styles.photo}
                onError={(e) => {
                  e.currentTarget.src =
                    "/placeholder.png";
                }}
              />
            </div>

            {/* INFORMACIÓN */}
            <div style={styles.profileInformation}>
              <InfoRow
                icon="bi bi-person-fill"
                iconColor="#0f766e"
                label="Nombre completo"
                value={
                  nombreCompleto || "N/A"
                }
              />

              <InfoRow
                icon="bi bi-card-heading"
                iconColor="#d97706"
                label="CURP"
                value={
                  datosPersonales.curp ||
                  "N/A"
                }
              />

              <InfoRow
                icon="bi bi-globe-americas"
                iconColor="#0891b2"
                label="Nacionalidad"
                value={
                  datosPersonales.nacionalidad ||
                  "N/A"
                }
              />

              <InfoRow
                icon="bi bi-telephone-fill"
                iconColor="#16a34a"
                label="Teléfono"
                value={
                  datosPersonales.telefono ||
                  "N/A"
                }
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            LICENCIA
        =================================================== */}
        <div style={styles.mainCard}>
          <SectionHeader
            icon="bi bi-credit-card-2-front-fill"
            title="Información de la licencia"
            description="Datos de identificación y vigencia"
            iconStyle={styles.sectionIconGreen}
          />

          <div style={styles.licenseGrid}>
            {/* TIPO */}
            <div style={styles.typeCard}>
              <div style={styles.typeCircle}>
                {licencia?.tipo || "N/A"}
              </div>

              <div>
                <span style={styles.smallLabel}>
                  Tipo de licencia
                </span>

                <strong style={styles.typeName}>
                  {licencia?.nombreTipo ||
                    "N/A"}
                </strong>
              </div>
            </div>

            {/* MATRÍCULA */}
            <LicenseInfoCard
              icon="bi bi-upc-scan"
              iconStyle={
                styles.iconBackgroundBlue
              }
              title="Matrícula"
              value={
                licencia?.matricula || "N/A"
              }
            />

            {/* FOLIO */}
            <LicenseInfoCard
              icon="bi bi-file-earmark-text-fill"
              iconStyle={
                styles.iconBackgroundOrange
              }
              title="Folio"
              value={
                licencia?.folio || "N/A"
              }
            />

            {/* VIGENCIA */}
            <LicenseInfoCard
              icon="bi bi-hourglass-split"
              iconStyle={
                styles.iconBackgroundPurple
              }
              title="Vigencia"
              value={
                licencia?.periodo
                  ? `${licencia.periodo} años`
                  : "N/A"
              }
            />
          </div>

          {/* FECHAS */}
          <div style={styles.datesGrid}>
            <DateCard
              icon="bi bi-calendar-plus-fill"
              iconColor="#2563eb"
              title="Expedición"
              value={formatearFecha(
                licencia?.expedida
              )}
            />

            <DateCard
              icon="bi bi-calendar-x-fill"
              iconColor="#dc2626"
              title="Vencimiento"
              value={formatearFecha(
                licencia?.vencimiento
              )}
            />

            <DateCard
              icon="bi bi-calendar-check-fill"
              iconColor="#0f766e"
              title="Antigüedad"
              value={formatearFecha(
                licencia?.antiguedad
              )}
            />
          </div>
        </div>

        {/* ==================================================
            INFORMACIÓN ADICIONAL
        =================================================== */}
        <div style={styles.mainCard}>
          <SectionHeader
            icon="bi bi-heart-pulse-fill"
            title="Información adicional"
            description="Datos complementarios del ciudadano"
            iconStyle={styles.sectionIconRed}
          />

          <div style={styles.additionalGrid}>
            <AdditionalItem
              icon="bi bi-droplet-fill"
              iconColor="#dc2626"
              title="Tipo sanguíneo"
              value={
                datosPersonales.tipoSanguineo ||
                "N/A"
              }
            />

            <AdditionalItem
              icon="bi bi-calendar-event-fill"
              iconColor="#7c3aed"
              title="Fecha de nacimiento"
              value={formatearFecha(
                datosPersonales.nacimiento
              )}
            />

            <AdditionalItem
              icon="bi bi-heart-fill"
              iconColor="#16a34a"
              title="Donador"
              value={
                datosPersonales.donador
                  ? "Sí"
                  : "No"
              }
            />

            <AdditionalItem
              icon="bi bi-exclamation-triangle-fill"
              iconColor="#ea580c"
              title="Alergias"
              value={
                datosPersonales.alergias
                  ? "Sí"
                  : "No"
              }
            />
          </div>

          {/* FIRMA */}
          <div style={styles.signatureContainer}>
            <div style={styles.signatureHeader}>
              <div style={styles.signatureIcon}>
                <i className="bi bi-pen-fill"></i>
              </div>

              <div>
                <strong style={styles.signatureTitle}>
                  Firma del ciudadano
                </strong>

                <span
                  style={
                    styles.signatureDescription
                  }
                >
                  Firma asociada al registro
                </span>
              </div>
            </div>

            <div style={styles.signatureBox}>
              <img
                src={firma}
                alt="Firma del ciudadano"
                style={styles.signature}
                onError={(e) => {
                  e.currentTarget.src =
                    "/firma.png";
                }}
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            VISTA PREVIA PDF
        =================================================== */}
        {licencia && (
          <div style={styles.mainCard}>
            <div style={styles.pdfHeader}>
              <SectionHeader
                icon="bi bi-file-earmark-pdf-fill"
                title="Vista previa de la licencia"
                description="Documento generado con la información registrada"
                iconStyle={
                  styles.sectionIconPurple
                }
              />

              <button
                type="button"
                style={styles.printButton}
                onClick={imprimirLicencia}
              >
                <i className="bi bi-printer-fill"></i>
                Imprimir licencia
              </button>
            </div>

            <div
              style={
                styles.pdfViewerContainer
              }
            >
              <LicenciaPreview
                licencia={licencia}
              />
            </div>
          </div>
        )}

        {/* ==================================================
            BOTONES
        =================================================== */}
        <div style={styles.actionsContainer}>
          <button
            type="button"
            onClick={() =>
              setShowLicencia(false)
            }
            style={styles.newLicenseButton}
          >
            <i className="bi bi-plus-circle-fill"></i>
            Registrar otra licencia
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTES VISUALES
// ============================================================

function SectionHeader({
  icon,
  title,
  description,
  iconStyle,
}) {
  return (
    <div style={styles.sectionHeader}>
      <div
        style={{
          ...styles.sectionIcon,
          ...iconStyle,
        }}
      >
        <i className={icon}></i>
      </div>

      <div>
        <h3 style={styles.sectionTitle}>
          {title}
        </h3>

        <p style={styles.sectionDescription}>
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  iconColor,
  label,
  value,
}) {
  return (
    <div style={styles.infoRow}>
      <div
        style={{
          ...styles.infoIcon,
          color: iconColor,
        }}
      >
        <i className={icon}></i>
      </div>

      <div>
        <span style={styles.infoLabel}>
          {label}
        </span>

        <strong style={styles.infoValue}>
          {value}
        </strong>
      </div>
    </div>
  );
}

function LicenseInfoCard({
  icon,
  iconStyle,
  title,
  value,
}) {
  return (
    <div style={styles.licenseInfoCard}>
      <div
        style={{
          ...styles.licenseInfoIcon,
          ...iconStyle,
        }}
      >
        <i className={icon}></i>
      </div>

      <div>
        <span style={styles.smallLabel}>
          {title}
        </span>

        <strong style={styles.licenseInfoValue}>
          {value}
        </strong>
      </div>
    </div>
  );
}

function DateCard({
  icon,
  iconColor,
  title,
  value,
}) {
  return (
    <div style={styles.dateCard}>
      <i
        className={icon}
        style={{
          ...styles.dateIcon,
          color: iconColor,
        }}
      ></i>

      <div>
        <span style={styles.smallLabel}>
          {title}
        </span>

        <strong style={styles.dateValue}>
          {value}
        </strong>
      </div>
    </div>
  );
}

function AdditionalItem({
  icon,
  iconColor,
  title,
  value,
}) {
  return (
    <div style={styles.additionalItem}>
      <div
        style={{
          ...styles.additionalIcon,
          color: iconColor,
        }}
      >
        <i className={icon}></i>
      </div>

      <div>
        <span style={styles.smallLabel}>
          {title}
        </span>

        <strong style={styles.additionalValue}>
          {value}
        </strong>
      </div>
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

  // ==========================================================
  // HEADER
  // ==========================================================
  header: {
    background:
      "linear-gradient(135deg, #4c1d95 0%, #7c3aed 55%, #a78bfa 100%)",

    borderRadius: "20px",

    padding: "28px 32px",

    color: "#ffffff",

    marginBottom: "24px",

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
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
  },

  subtitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    opacity: 0.85,
  },

  // ==========================================================
  // CONTENT
  // ==========================================================
  content: {
    width: "100%",
  },

  mainCard: {
    background: "#ffffff",

    borderRadius: "20px",

    border: "1px solid #eeeaff",

    boxShadow:
      "0 8px 30px rgba(30,27,75,0.07)",

    padding: "28px",

    marginBottom: "24px",
  },

  // ==========================================================
  // SECTION HEADER
  // ==========================================================
  sectionHeader: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    paddingBottom: "15px",

    marginBottom: "22px",

    borderBottom:
      "1px solid #f1f5f9",
  },

  sectionIcon: {
    width: "42px",

    height: "42px",

    minWidth: "42px",

    borderRadius: "12px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "18px",
  },

  sectionIconBlue: {
    background: "#dbeafe",
    color: "#2563eb",
  },

  sectionIconGreen: {
    background: "#dcfce7",
    color: "#16a34a",
  },

  sectionIconRed: {
    background: "#fee2e2",
    color: "#dc2626",
  },

  sectionIconPurple: {
    background: "#ede9fe",
    color: "#7c3aed",
  },

  sectionTitle: {
    margin: 0,

    color: "#312e81",

    fontSize: "16px",

    fontWeight: "700",
  },

  sectionDescription: {
    margin: "3px 0 0",

    color: "#94a3b8",

    fontSize: "12px",
  },

  // ==========================================================
  // PERFIL
  // ==========================================================
  profileContainer: {
    display: "flex",

    gap: "28px",

    alignItems: "flex-start",

    flexWrap: "wrap",
  },

  photoContainer: {
    width: "160px",
  },

  photo: {
    width: "160px",

    height: "195px",

    objectFit: "cover",

    borderRadius: "14px",

    border: "1px solid #e2e8f0",

    background: "#f1f5f9",

    boxShadow:
      "0 4px 14px rgba(15,23,42,0.08)",
  },

  profileInformation: {
    flex: 1,

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px,1fr))",

    gap: "18px",

    minWidth: "280px",
  },

  infoRow: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    padding: "14px",

    border: "1px solid #e2e8f0",

    borderRadius: "12px",

    background: "#fafafa",
  },

  infoIcon: {
    width: "38px",

    height: "38px",

    minWidth: "38px",

    borderRadius: "10px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#ffffff",

    fontSize: "17px",

    border: "1px solid #e2e8f0",
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

    color: "#334155",

    fontSize: "13px",
  },

  // ==========================================================
  // LICENCIA
  // ==========================================================
  licenseGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px,1fr))",

    gap: "15px",
  },

  typeCard: {
    display: "flex",

    alignItems: "center",

    gap: "13px",

    padding: "16px",

    border: "1px solid #ddd6fe",

    borderRadius: "13px",

    background: "#faf9ff",
  },

  typeCircle: {
    width: "52px",

    height: "52px",

    minWidth: "52px",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg, #4c1d95, #7c3aed)",

    color: "#ffffff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "20px",

    fontWeight: "800",
  },

  typeName: {
    display: "block",

    color: "#312e81",

    fontSize: "14px",

    marginTop: "3px",
  },

  licenseInfoCard: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    padding: "16px",

    border: "1px solid #e2e8f0",

    borderRadius: "13px",

    background: "#ffffff",
  },

  licenseInfoIcon: {
    width: "42px",

    height: "42px",

    minWidth: "42px",

    borderRadius: "11px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "17px",
  },

  iconBackgroundBlue: {
    background: "#dbeafe",
    color: "#2563eb",
  },

  iconBackgroundOrange: {
    background: "#ffedd5",
    color: "#ea580c",
  },

  iconBackgroundPurple: {
    background: "#ede9fe",
    color: "#7c3aed",
  },

  smallLabel: {
    display: "block",

    color: "#94a3b8",

    fontSize: "10px",

    textTransform: "uppercase",

    marginBottom: "3px",
  },

  licenseInfoValue: {
    display: "block",

    color: "#334155",

    fontSize: "14px",
  },

  datesGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px,1fr))",

    gap: "15px",

    marginTop: "22px",

    paddingTop: "22px",

    borderTop: "1px solid #f1f5f9",
  },

  dateCard: {
    display: "flex",

    alignItems: "center",

    gap: "11px",

    padding: "13px",

    background: "#f8fafc",

    borderRadius: "11px",
  },

  dateIcon: {
    fontSize: "20px",
  },

  dateValue: {
    display: "block",

    color: "#334155",

    fontSize: "13px",
  },

  // ==========================================================
  // ADICIONAL
  // ==========================================================
  additionalGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px,1fr))",

    gap: "15px",
  },

  additionalItem: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    padding: "14px",

    border: "1px solid #e2e8f0",

    borderRadius: "12px",

    background: "#fafafa",
  },

  additionalIcon: {
    width: "40px",

    height: "40px",

    minWidth: "40px",

    borderRadius: "10px",

    background: "#ffffff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "17px",

    border: "1px solid #e2e8f0",
  },

  additionalValue: {
    display: "block",

    color: "#334155",

    fontSize: "13px",
  },

  // ==========================================================
  // FIRMA
  // ==========================================================
  signatureContainer: {
    marginTop: "25px",

    paddingTop: "22px",

    borderTop: "1px solid #f1f5f9",
  },

  signatureHeader: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    marginBottom: "15px",
  },

  signatureIcon: {
    width: "40px",

    height: "40px",

    borderRadius: "11px",

    background: "#ede9fe",

    color: "#7c3aed",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",
  },

  signatureTitle: {
    display: "block",

    color: "#312e81",

    fontSize: "13px",
  },

  signatureDescription: {
    display: "block",

    color: "#94a3b8",

    fontSize: "11px",

    marginTop: "2px",
  },

  signatureBox: {
    minHeight: "100px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#fafafa",

    border: "1px dashed #cbd5e1",

    borderRadius: "12px",
  },

  signature: {
    width: "210px",

    height: "80px",

    objectFit: "contain",
  },

  // ==========================================================
  // PDF
  // ==========================================================
  pdfHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

    gap: "20px",

    flexWrap: "wrap",
  },

  pdfViewerContainer: {
    width: "100%",

    overflow: "hidden",

    borderRadius: "12px",

    border: "1px solid #e2e8f0",

    background: "#f8fafc",
  },

  printButton: {
    border: "none",

    minHeight: "43px",

    padding: "0 17px",

    borderRadius: "10px",

    background: "#dc2626",

    color: "#ffffff",

    cursor: "pointer",

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "8px",

    fontSize: "12px",

    fontWeight: "600",

    boxShadow:
      "0 4px 12px rgba(220,38,38,0.18)",
  },

  // ==========================================================
  // ACCIONES
  // ==========================================================
  actionsContainer: {
    display: "flex",

    justifyContent: "center",

    paddingBottom: "20px",
  },

  newLicenseButton: {
    minWidth: "220px",

    height: "46px",

    border: "none",

    borderRadius: "11px",

    background: "#16a34a",

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "13px",

    fontWeight: "600",

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "8px",

    boxShadow:
      "0 5px 15px rgba(22,163,74,0.20)",
  },

  backButton: {
    marginTop: "10px",

    border: "none",

    padding: "10px 18px",

    borderRadius: "10px",

    background: "#7c3aed",

    color: "#ffffff",

    cursor: "pointer",

    display: "inline-flex",

    alignItems: "center",

    gap: "8px",
  },

  // ==========================================================
  // LOADING
  // ==========================================================
  loadingContainer: {
    minHeight: "500px",

    background: "#ffffff",

    borderRadius: "20px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    boxShadow:
      "0 8px 30px rgba(30,27,75,0.07)",
  },

  spinner: {
    color: "#7c3aed",

    width: "3rem",

    height: "3rem",
  },

  loadingTitle: {
    margin: "18px 0 5px",

    color: "#312e81",

    fontSize: "18px",
  },

  loadingText: {
    margin: 0,

    color: "#94a3b8",

    fontSize: "13px",
  },

  // ==========================================================
  // ERROR
  // ==========================================================
  errorContainer: {
    minHeight: "500px",

    background: "#ffffff",

    borderRadius: "20px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    textAlign: "center",

    padding: "30px",

    boxShadow:
      "0 8px 30px rgba(30,27,75,0.07)",
  },

  errorIconContainer: {
    width: "65px",

    height: "65px",

    borderRadius: "18px",

    background: "#fee2e2",

    color: "#dc2626",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "28px",

    marginBottom: "15px",
  },

  errorTitle: {
    margin: 0,

    color: "#334155",

    fontSize: "18px",
  },

  errorText: {
    color: "#94a3b8",

    fontSize: "13px",

    margin: "7px 0 15px",
  },
};

export default LicenciaPage;