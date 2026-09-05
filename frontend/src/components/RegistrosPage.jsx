import React, { useState, useEffect } from "react";
import LicenciaForm from "./LicenciaForm";
import LicenciaPage from "./LicenciaPage";
import DatosPersonalesForm from "./DatosPersonalesForm";

function RegistrosPage() {
  const [ciudadanos, setCiudadanos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "licencia" | "ver" | "editarCiudadano" | "previewLicencia"
  const [selectedCiudadano, setSelectedCiudadano] = useState(null);
  const [selectedLicencia, setSelectedLicencia] = useState(null);

  // Cargar ciudadanos
  useEffect(() => {
    const fetchCiudadanos = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3020/api/v1/ciudadanos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCiudadanos(data || []);
      } catch (err) {
        console.error("Error al cargar ciudadanos:", err);
      }
    };
    fetchCiudadanos();
  }, []);

  // Acciones
  const editarCiudadano = (ciudadano) => {
    setSelectedCiudadano(ciudadano);
    setModalMode("editarCiudadano");
    setShowModal(true);
  };

  const agregarLicencia = (ciudadano) => {
    setSelectedCiudadano(ciudadano);
    setModalMode("licencia");
    setShowModal(true);
  };

  const verCiudadano = (ciudadano) => {
    setSelectedCiudadano(ciudadano);
    setModalMode("ver");
    setShowModal(true);
  };

  const previewLicencia = (ciudadano, licencia) => {
    setSelectedCiudadano(ciudadano);
    setSelectedLicencia(licencia);
    setModalMode("previewLicencia");
    setShowModal(true);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Registros de Ciudadanos</h2>

      {/* Buscador */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar ciudadano..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      {/* Tabla */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>CURP</th>
            <th>Teléfono</th>
            <th>Licencias</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ciudadanos
            .filter((c) =>
              c.datosPersonales?.nombre.toLowerCase().includes(search.toLowerCase()) ||
              c.datosPersonales?.curp.toLowerCase().includes(search.toLowerCase())
            )
            .map((c) => (
              <tr key={c._id}>
                <td>{c.datosPersonales?.nombre} {c.datosPersonales?.apellidoPaterno} {c.datosPersonales?.apellidoMaterno}</td>
                <td>{c.datosPersonales?.curp}</td>
                <td>{c.datosPersonales?.telefono}</td>
                <td>{c.licencias?.length || 0}</td>
                <td>
                  <button style={styles.actionButton} onClick={() => verCiudadano(c)}>👁 Ver</button>
                  <button style={styles.actionButton} onClick={() => editarCiudadano(c)}>✏️ Editar</button>
                  <button style={styles.actionButton} onClick={() => agregarLicencia(c)}>➕ Licencia</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {modalMode === "editarCiudadano" && (
              <>
                <h3>Editar Ciudadano</h3>
                <DatosPersonalesForm ciudadano={selectedCiudadano} onSaved={() => setShowModal(false)} />
              </>
            )}

            {modalMode === "licencia" && (
              <>
                <h3>Agregar Licencia a {selectedCiudadano?.datosPersonales?.nombre}</h3>
                <LicenciaForm ciudadanoId={selectedCiudadano._id} setShowLicencia={() => setShowModal(false)} />
              </>
            )}

            {modalMode === "ver" && (
              <>
                <h3>Datos de {selectedCiudadano?.datosPersonales?.nombre}</h3>
                <LicenciaPage ciudadanoId={selectedCiudadano._id} />
                <h4>Licencias</h4>
                {selectedCiudadano?.licencias?.map((lic) => (
                  <div key={lic._id} style={styles.licenciaCard}>
                    <p><strong>Tipo:</strong> {lic.tipo} - {lic.nombreTipo}</p>
                    <p><strong>Folio:</strong> {lic.folio}</p>
                    <button style={styles.actionButton} onClick={() => previewLicencia(selectedCiudadano, lic)}>👁 Preview</button>
                    <button style={styles.actionButton}>✏️ Editar Licencia</button>
                  </div>
                ))}
              </>
            )}

            {modalMode === "previewLicencia" && (
              <>
                <h3>Preview de Licencia</h3>
                <LicenciaPage ciudadanoId={selectedCiudadano._id} licenciaId={selectedLicencia._id} />
              </>
            )}

            <button style={styles.cancelButton} onClick={() => setShowModal(false)}>❌ Cerrar</button>
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
    cursor: "pointer", background: "#2563eb", color: "#fff",
  },
  modalOverlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center",
  },
  modal: {
    background: "#fff", padding: "20px", borderRadius: "8px", width: "700px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto",
  },
  cancelButton: {
    marginTop: "10px", padding: "8px 12px", background: "#dc2626", border: "none",
    borderRadius: "5px", color: "#fff", cursor: "pointer",
  },
  licenciaCard: {
    background: "#f1f5f9", padding: "10px", borderRadius: "6px", marginBottom: "10px",
  },
};

export default RegistrosPage;
