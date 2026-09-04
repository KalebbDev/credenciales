import React, { useState } from "react";
import DatosPersonalesForm from "./DatosPersonalesForm";
import LicenciaForm from "./LicenciaForm";


function Dashboard({ usuario, onLogout }) {
  const [ciudadanoId, setCiudadanoId] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f9fafb" }}>
      {/* Sidebar */}
      <aside style={{ width: "220px", background: "#1e293b", color: "#fff", padding: "20px" }}>
        <h3>Menú</h3>
        <button onClick={() => alert("Usuarios")}>Usuarios</button>
        <button onClick={() => alert("Nueva Licencia")}>Nueva Licencia</button>
        <button onClick={onLogout}>Salir</button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "40px" }}>
        {!ciudadanoId ? (
          <>
            <h2>Formulario de Datos Personales</h2>
            <DatosPersonalesForm onSaved={setCiudadanoId} />
          </>
        ) : (
          <>
            <h2>Formulario de Licencia</h2>
            <LicenciaForm ciudadanoId={ciudadanoId} />
          </>
        )}
      </main>
    </div>
  );
}


const styles = {
  menuButton: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    background: "#334155",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "1rem",
  },
};

export default Dashboard;
