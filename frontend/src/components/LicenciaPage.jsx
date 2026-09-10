import React, { useEffect, useState } from "react";
import LicenciaPreview from "./LicenciaPreview";

function LicenciaPage({ ciudadanoId, setShowLicencia }) {
  const [ciudadano, setCiudadano] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCiudadano = async () => {
      const token = localStorage.getItem("token");

      try {
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
            data.message || "No se pudieron cargar los datos"
          );
        }

        setCiudadano(data);
      } catch (err) {
        console.error("Error al cargar ciudadano:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCiudadano();
  }, [ciudadanoId]);

  // ==============================
  // CARGANDO
  // ==============================

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner-border" style={styles.spinner}></div>
        <p style={styles.loadingText}>Cargando licencia...</p>
      </div>
    );
  }

  if (!ciudadano) {
    return (
      <div style={styles.errorContainer}>
        <i
          className="bi bi-exclamation-circle"
          style={styles.errorIcon}
        ></i>

        <h4>No se pudieron cargar los datos</h4>

        <button
          type="button"
          onClick={() => setShowLicencia(false)}
          style={styles.newLicenseButton}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nueva licencia
        </button>
      </div>
    );
  }

  // Última licencia registrada
  const licencia =
    ciudadano.licencias?.[
      ciudadano.licencias.length - 1
    ];

  const datosPersonales = ciudadano.datosPersonales || {};

  // ==============================
  // DATOS
  // ==============================

  const nombreCompleto = `
    ${datosPersonales.nombre || ""}
    ${datosPersonales.apellidoPaterno || ""}
    ${datosPersonales.apellidoMaterno || ""}
  `.trim();

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";

    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fotografia = datosPersonales.fotografia
    ? `http://localhost:3020${datosPersonales.fotografia}`
    : "/placeholder.png";

  const firma = datosPersonales.firma
    ? `http://localhost:3020${datosPersonales.firma}`
    : "/firma.png";

  return (
    <div style={styles.page}>

      

      {/* =====================================
          CONTENIDO PRINCIPAL
      ====================================== */}

      <div style={styles.content}>

        {/* =================================
            TARJETA DE LICENCIA
        ================================== */}

        <div style={styles.licenseCard}>
<div style={styles.sectionTitle}>
            <i className="bi bi-person-vcard"></i>

            <span>
              Información Personal
            </span>
            
          </div>
          {/* FOTO */}
          <p></p>
          <div style={styles.photoContainer}>
            <img
              src={fotografia}
              alt="Fotografía del ciudadano"
              style={styles.photo}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          </div>


          {/* INFORMACIÓN PRINCIPAL */}
          <div style={styles.mainInformation}>

            <div style={styles.dataRow}>
              <span style={styles.label}>
                Nombre:
              </span>

              <span style={styles.value}>
                {nombreCompleto || "N/A"}
              </span>
            </div>


            <div style={styles.dataRow}>
              <span style={styles.label}>
                CURP:
              </span>

              <span style={styles.value}>
                {datosPersonales.curp || "N/A"}
              </span>
            </div>


            <div style={styles.dataRow}>
              <span style={styles.label}>
                Nacionalidad:
              </span>

              <span style={styles.value}>
                {datosPersonales.nacionalidad || "N/A"}
              </span>
            </div>

          </div>


          {/* =============================
              FECHAS
          ============================== */}

          <div style={styles.datesContainer}>

            <div style={styles.dateBox}>
              <span style={styles.dateLabel}>
                Expedición:
              </span>

              <span style={styles.dateValue}>
                {formatearFecha(licencia?.expedida)}
              </span>
            </div>


            <div style={styles.dateBox}>
              <span style={styles.dateLabel}>
                Vencimiento:
              </span>

              <span style={styles.dateValue}>
                {formatearFecha(licencia?.vencimiento)}
              </span>
            </div>

          </div>


          {/* =============================
              VIGENCIA
          ============================== */}

          <div style={styles.validity}>
            <span style={styles.validityLabel}>
              Vigencia:
            </span>

            <span style={styles.validityValue}>
              {licencia?.periodo || "N/A"} Años
            </span>
          </div>


          {/* =============================
              TIPO DE LICENCIA
          ============================== */}

          <div style={styles.licenseType}>

            <div style={styles.typeCircle}>
              {licencia?.tipo || "N/A"}
            </div>

            <div style={styles.typeInformation}>
              <span style={styles.typeTitle}>
                Tipo de licencia
              </span>

              <span style={styles.typeName}>
                {licencia?.nombreTipo || "N/A"}
              </span>
            </div>

          </div>


          {/* =============================
              MATRÍCULA
          ============================== */}

          <div style={styles.matricula}>
            <span style={styles.matriculaLabel}>
              Matrícula:
            </span>

            <span style={styles.matriculaValue}>
              {licencia?.matricula || "N/A"}
            </span>
          </div>


          {/* =============================
              FOLIO
          ============================== */}

          <div style={styles.folio}>
            <span>
              Folio:
            </span>

            <strong>
              {licencia?.folio || "N/A"}
            </strong>
          </div>

        </div>


        {/* =====================================
            INFORMACIÓN ADICIONAL
        ====================================== */}

        <div style={styles.additionalCard}>

          <div style={styles.sectionTitle}>
            <i className="bi bi-person-vcard"></i>

            <span>
              Información adicional
            </span>
          </div>


          <div style={styles.additionalGrid}>

            <div style={styles.additionalItem}>
              <span>Tipo sanguíneo</span>

              <strong>
                {datosPersonales.tipoSanguineo || "N/A"}
              </strong>
            </div>


            <div style={styles.additionalItem}>
              <span>Teléfono</span>

              <strong>
                {datosPersonales.telefono || "N/A"}
              </strong>
            </div>


            <div style={styles.additionalItem}>
              <span>Fecha de nacimiento</span>

              <strong>
                {formatearFecha(
                  datosPersonales.nacimiento
                )}
              </strong>
            </div>


            <div style={styles.additionalItem}>
              <span>Antigüedad</span>

              <strong>
                {formatearFecha(
                  licencia?.antiguedad
                )}
              </strong>
            </div>


            <div style={styles.additionalItem}>
              <span>Donador</span>

              <strong>
                {datosPersonales.donador
                  ? "Sí"
                  : "No"}
              </strong>
            </div>


            <div style={styles.additionalItem}>
              <span>Alergias</span>

              <strong>
                {datosPersonales.alergias ||
                  "Ninguna registrada"}
              </strong>
            </div>

          </div>


          {/* FIRMA */}

          <div style={styles.signatureContainer}>

            <span style={styles.signatureLabel}>
              Firma
            </span>

            <img
              src={firma}
              alt="Firma del ciudadano"
              style={styles.signature}
              onError={(e) => {
                e.currentTarget.src = "/firma.png";
              }}
            />

          </div>

        </div>
        {/* =====================================
            PDF
        ====================================== */}
        {licencia && (
          <div style={styles.pdfSection}>
            <div style={styles.pdfHeader}>
              <div>
                <div style={styles.sectionTitle}>
                  <i className="bi bi-person-vcard"></i>
                  <span> Previa Vista </span>
                </div>
              </div>
            </div>

            <div style={styles.pdfViewerContainer}>
              <LicenciaPreview licencia={licencia} />
            </div>
            <div style={styles.pdfButtons}>
              <button
                style={styles.pdfButton}
                onClick={() => {
                  const iframe = document.querySelector("iframe[title='Licencia PDF']");
                  if (iframe) {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                  } else {
                    alert("No se encontró la vista previa de la licencia.");
                  }
                }}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>
                Imprimir licencia
              </button>
            </div>

          </div>
        )}
        {/* =====================================
            BOTÓN NUEVA LICENCIA
        ====================================== */}

        <div style={styles.newLicenseContainer}>
  <button
    type="button"
    onClick={() => setShowLicencia(false)}
    style={styles.newLicenseButton}
  >
    <i className="bi bi-arrow-left me-2"></i>
    Nueva licencia
  </button>
</div>

      </div>

    </div>
  );
}


/* =====================================================
   ESTILOS
===================================================== */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5f5f7",
    paddingBottom: "50px",
    fontFamily:
      "'Segoe UI', Arial, sans-serif",
  },


  /* HEADER */

  topHeader: {
    position: "relative",
    width: "100%",
    minHeight: "180px",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)",
  },


  headerPattern: {
    position: "absolute",
    inset: 0,
    opacity: 0.08,
    backgroundImage:
      "radial-gradient(circle at 20% 20%, #ffffff 2px, transparent 2px)",
    backgroundSize: "25px 25px",
  },


  headerContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "950px",
    margin: "0 auto",
    padding: "30px 25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "22px",
  },


  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },


  logoCircle: {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    border: "3px solid rgba(255,255,255,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "2.3rem",
  },


  headerText: {
    color: "#fff",
    textAlign: "left",
  },


  institution: {
    fontSize: "1.55rem",
    fontWeight: "700",
    lineHeight: "1.15",
    letterSpacing: "1px",
  },


  licenseTitle: {
    marginTop: "12px",
    fontSize: "1.2rem",
    fontWeight: "600",
    letterSpacing: "2px",
  },


  /* CONTENT */

  content: {
    width: "100%",
    maxWidth: "950px",
    margin: "-25px auto 0",
    position: "relative",
    zIndex: 5,
    padding: "0 20px",
  },


  /* LICENSE CARD */

  licenseCard: {
    background: "#ffffff",
    minHeight: "450px",
    padding: "30px",
    borderRadius: "8px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.12)",
    position: "relative",
    overflow: "hidden",
  },


  photoContainer: {
    float: "left",
    marginRight: "30px",
    marginBottom: "20px",
  },


  photo: {
    width: "145px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "4px",
    border: "1px solid #ddd",
    background: "#f1f5f9",
  },


  mainInformation: {
    paddingTop: "5px",
  },


  dataRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "18px",
    fontSize: "1rem",
  },


  label: {
    color: "#222",
    fontWeight: "600",
    minWidth: "115px",
  },


  value: {
    color: "#111",
    fontWeight: "400",
  },


  datesContainer: {
    clear: "both",
    display: "flex",
    flexWrap: "wrap",
    gap: "45px",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #eeeeee",
  },


  dateBox: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },


  dateLabel: {
    fontWeight: "600",
    color: "#222",
  },


  dateValue: {
    color: "#333",
  },


  validity: {
    marginTop: "25px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },


  validityLabel: {
    fontSize: "1.05rem",
    fontWeight: "600",
  },


  validityValue: {
    fontSize: "1.05rem",
  },


  /* TIPO */

  licenseType: {
    marginTop: "25px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },


  typeCircle: {
    width: "62px",
    height: "62px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #4c1d95, #7c3aed)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: "800",
    boxShadow:
      "0 4px 12px rgba(124,58,237,0.25)",
  },


  typeInformation: {
    display: "flex",
    flexDirection: "column",
  },


  typeTitle: {
    fontSize: "0.8rem",
    color: "#777",
  },


  typeName: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#222",
  },


  /* MATRICULA */

  matricula: {
    marginTop: "25px",
    paddingTop: "18px",
    borderTop: "1px solid #eeeeee",
    display: "flex",
    gap: "10px",
  },


  matriculaLabel: {
    fontWeight: "600",
  },


  matriculaValue: {
    fontWeight: "700",
    letterSpacing: "1px",
  },


  /* FOLIO */

  folio: {
    marginTop: "12px",
    display: "flex",
    gap: "10px",
    fontSize: "0.9rem",
    color: "#666",
  },


  /* ADDITIONAL */

  additionalCard: {
    marginTop: "25px",
    background: "#fff",
    borderRadius: "8px",
    padding: "25px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,0.08)",
  },


  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#4c1d95",
    fontSize: "1.1rem",
    fontWeight: "700",
    paddingBottom: "15px",
    borderBottom: "1px solid #eeeeee",
  },


  additionalGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },


  additionalItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },


  /* FIRMA */

  signatureContainer: {
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #eeeeee",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },


  signatureLabel: {
    fontSize: "0.85rem",
    color: "#777",
  },


  signature: {
    width: "190px",
    height: "70px",
    objectFit: "contain",
    marginTop: "5px",
  },


  /* RECUADRO NEGRO */

  blackBox: {
    marginTop: "25px",
    minHeight: "150px",
    background: "#111111",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },


  blackBoxContent: {
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    opacity: 0.8,
  },


  /* PDF */

  pdfSection: {
    marginTop: "30px",
    background: "#fff",
    borderRadius: "8px",
    padding: "25px",
    boxShadow:
      "0 5px 18px rgba(0,0,0,0.08)",
  },


  pdfHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },


  pdfTitle: {
    margin: 0,
    color: "#334155",
    fontWeight: "700",
  },


  pdfDescription: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "0.9rem",
  },


  pdfViewerContainer: {
    width: "100%",
    overflow: "hidden",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },


  pdfViewer: {
    width: "100%",
    height: "550px",
    border: "none",
  },


  pdfButtons: {
    marginTop: "15px",
    textAlign: "right",
  },


  pdfButton: {
    display: "inline-flex",
    alignItems: "center",
    padding: "11px 20px",
    background:
      "linear-gradient(135deg, #4c1d95, #7c3aed)",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    boxShadow:
      "0 4px 12px rgba(124,58,237,0.2)",
  },


  /* NUEVA LICENCIA */

  newLicenseContainer: {
    marginTop: "30px",
    textAlign: "center",
  },


  newLicenseButton: {
    border: "none",
    padding: "12px 28px",
    borderRadius: "9px",
    background: "#fff",
    color: "#6d28d9",
    border: "1px solid #ddd6fe",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.06)",
  },


  /* LOADING */

  loadingContainer: {
    minHeight: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },


  spinner: {
    color: "#7c3aed",
    width: "3rem",
    height: "3rem",
  },


  loadingText: {
    marginTop: "15px",
    color: "#64748b",
  },


  /* ERROR */

  errorContainer: {
    minHeight: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
  },


  errorIcon: {
    fontSize: "3rem",
    color: "#dc2626",
    marginBottom: "15px",
  },

};

export default LicenciaPage;