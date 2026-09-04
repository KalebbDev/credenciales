import React, { useState, useEffect } from "react";

function RegistrosPage() {
  const [ciudadanos, setCiudadanos] = useState([]);
  const [search, setSearch] = useState("");

  // Cargar ciudadanos al montar la página
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

  // Función para mostrar estado de licencias
  const estadoLicencias = (licencias) => {
    if (!licencias || licencias.length === 0) return "Sin licencia";
    if (licencias.length === 1) return "1 licencia";
    return `${licencias.length} licencias`;
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
            <th>Nacionalidad</th>
            <th>Licencias</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {ciudadanos
            .filter((c) =>
            c.datosPersonales?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
            c.datosPersonales?.curp?.toLowerCase().includes(search.toLowerCase())
            )
            .map((c) => (
            <tr key={c._id}>
                <td>
                {c.datosPersonales?.nombre} {c.datosPersonales?.apellidoPaterno}{" "}
                {c.datosPersonales?.apellidoMaterno}
                </td>
                <td>{c.datosPersonales?.curp}</td>
                <td>{c.datosPersonales?.telefono}</td>
                <td>{c.datosPersonales?.nacionalidad}</td>
                <td>
                {c.licencias?.length === 0
                    ? "Sin licencia"
                    : c.licencias?.length === 1
                    ? "1 licencia"
                    : `${c.licencias?.length} licencias`}
                </td>
                <td>
                <button
                    style={styles.actionButton}
                    onClick={() => alert(`Ver detalle de ${c.datosPersonales?.nombre}`)}
                >
                    👁️ Ver
                </button>
                <button
                    style={styles.actionButton}
                    onClick={() => alert(`Agregar licencia a ${c.datosPersonales?.nombre}`)}
                >
                    ➕ Licencia
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
};

export default RegistrosPage;
