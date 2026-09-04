import React, { useState } from "react";
import DatosPersonalesForm from "./DatosPersonalesForm";
import LicenciaForm from "./LicenciaForm";
import UsuariosPage from "./UsuariosPage";
import RegistrosPage from "./RegistrosPage";



function Dashboard({ usuario, onLogout }) {
  const [view, setView] = useState("ciudadano"); // 👈 vista inicial: registro ciudadano
  const [ciudadanoId, setCiudadanoId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f9fafb" }}>
      {/* Sidebar */}
      {menuOpen && (
        <aside style={{ width: "220px", background: "#1e293b", color: "#fff", padding: "20px" }}>
          <h3>Menú</h3>
          {/* Solo ADMIN ve Usuarios */}
          {usuario.rol === "ADMIN" && (
            <button style={styles.menuButton} onClick={() => setView("usuarios")}>
              Usuarios
            </button>
          )}
          <button style={styles.menuButton} onClick={() => setView("ciudadano")}>
            Nueva Licencia
          </button>
          <button style={styles.menuButton} onClick={() => setView("registros")}>
            Registros
          </button>
          <button style={styles.menuButton} onClick={onLogout}>
            Salir
          </button>
        </aside>
      )}

      {/* Main */}
      <main style={{ flex: 1, padding: "40px" }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={styles.toggleButton}>
          ☰
        </button>

        {view === "ciudadano" && (
          !ciudadanoId ? (
            <>
              <h2>Registro de Ciudadano</h2>
              <DatosPersonalesForm onSaved={setCiudadanoId} />
            </>
          ) : (
            <>
              <h2>Formulario de Licencia</h2>
              <LicenciaForm ciudadanoId={ciudadanoId} />
            </>
          )
        )}

        {view === "usuarios" && usuario.rol === "ADMIN" && (
          <UsuariosPage />
        )}

        

        {view === "registros" && (
          <RegistrosPage />
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
  toggleButton: {
    marginBottom: "20px",
    padding: "8px 12px",
    background: "#64748b",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Dashboard;
