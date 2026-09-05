import React, { useEffect, useState } from "react";

function LicenciaPage({ ciudadanoId }) {
  const [ciudadano, setCiudadano] = useState(null);

  useEffect(() => {
    const fetchCiudadano = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:3020/api/v1/ciudadanos/${ciudadanoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCiudadano(data);
      } catch (err) {
        console.error("Error al cargar ciudadano:", err);
      }
    };
    fetchCiudadano();
  }, [ciudadanoId]);

  if (!ciudadano) return <p>Cargando datos...</p>;

  // Tomamos la última licencia registrada (preview final)
  const licencia = ciudadano.licencias?.[ciudadano.licencias.length - 1];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Licencia Registrada ✅</h2>

      <div style={styles.row}>
        {/* Div 1: Frontal */}
        <div style={styles.cardFront}>
          <h3>Frontal</h3>
          <img
            src={ciudadano.datosPersonales?.fotografia 
              ? `http://localhost:3020${ciudadano.datosPersonales.fotografia}` 
              : "/placeholder.png"}
            alt="Foto ciudadano"
            style={styles.photo}
          />
          <p><strong>Nombre:</strong> {ciudadano.datosPersonales?.nombre} {ciudadano.datosPersonales?.apellidoPaterno} {ciudadano.datosPersonales?.apellidoMaterno}</p>
          <p><strong>CURP:</strong> {ciudadano.datosPersonales?.curp}</p>
          <p><strong>Nacionalidad:</strong> {ciudadano.datosPersonales?.nacionalidad}</p>
          <p><strong>Expedida:</strong> {licencia?.expedida ? new Date(licencia.expedida).toLocaleDateString() : "N/A"}</p>
          <p><strong>Vigencia:</strong> {licencia?.vencimiento ? new Date(licencia.vencimiento).toLocaleDateString() : "N/A"}</p>
          <p><strong>Tipo:</strong> {licencia?.tipo}</p>
          <p><strong>Matrícula:</strong> {licencia?.matricula}</p>
          <p><strong>Clase:</strong> {licencia?.nombreTipo}</p>
        </div>

        {/* Div 2: Reverso */}
        <div style={styles.cardBack}>
          <h3>Datos adicionales</h3>
          <p><strong>Tipo sanguíneo:</strong> {ciudadano.datosPersonales?.tipoSanguineo}</p>
          <p><strong>Teléfono:</strong> {ciudadano.datosPersonales?.telefono}</p>
          <p><strong>Nacimiento:</strong> {ciudadano.datosPersonales?.nacimiento ? new Date(ciudadano.datosPersonales.nacimiento).toLocaleDateString() : "N/A"}</p>
          <p><strong>Antigüedad:</strong> {licencia?.antiguedad ? new Date(licencia.antiguedad).toLocaleDateString() : "N/A"}</p>
          <p><strong>Donador:</strong> {ciudadano.datosPersonales?.donador ? "Sí" : "No"}</p>
          <p><strong>Alergias:</strong> {ciudadano.datosPersonales?.alergias}</p>
          <img
            src={ciudadano.datosPersonales?.firma 
              ? `http://localhost:3020${ciudadano.datosPersonales.firma}` 
              : "/firma.png"}
            alt="Firma"
            style={styles.signature}
          />
        </div>
      </div>

      {/* PDF Preview */}
      {licencia && (
        <div style={styles.pdfSection}>
          <h3>Documento PDF</h3>
          <iframe
            src={`http://localhost:3020/api/v1/licencias/${licencia._id}/pdf`}
            style={styles.pdfViewer}
            title="Licencia PDF"
          />
          <a
            href={`http://localhost:3020/api/v1/licencias/${licencia._id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.downloadButton}
          >
            📄 Descargar PDF
          </a>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", padding: "20px" },
  title: { textAlign: "center", marginBottom: "20px", color: "#1e293b" },
  row: { display: "flex", gap: "20px", justifyContent: "space-between" },
  cardFront: {
    flex: 1,
    background: "#f1f5f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  cardBack: {
    flex: 1,
    background: "#f9fafb",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  photo: { width: "120px", height: "150px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px" },
  signature: { width: "150px", height: "50px", objectFit: "contain", marginTop: "10px" },
  pdfSection: { marginTop: "30px", textAlign: "center" },
  pdfViewer: { width: "100%", height: "400px", border: "1px solid #ccc", borderRadius: "6px" },
  downloadButton: {
    display: "inline-block",
    marginTop: "10px",
    padding: "10px 15px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    textDecoration: "none",
  },
};

export default LicenciaPage;
