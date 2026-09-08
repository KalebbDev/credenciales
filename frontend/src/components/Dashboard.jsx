import React, { useState } from "react";
import DatosPersonalesForm from "./DatosPersonalesForm";
import LicenciaForm from "./LicenciaForm";
import UsuariosPage from "./UsuariosPage";
import RegistrosPage from "./RegistrosPage";
import LicenciaPage from "./LicenciaPage";

function Dashboard({ usuario, onLogout }) {
  const [view, setView] = useState("ciudadano");
  const [ciudadanoId, setCiudadanoId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const [showLicencia, setShowLicencia] = useState(false);

  return (
    <div style={styles.dashboard}>

      {/* ================= SIDEBAR ================= */}
      <aside
        style={{
          ...styles.sidebar,
          width: menuOpen ? "260px" : "78px",
        }}
      >

        {/* Logo / encabezado */}
        <div style={styles.sidebarHeader}>

          {menuOpen && (
            <div style={styles.brandContainer}>
              <div style={styles.logo}>
                LC
              </div>

              <div>
                <div style={styles.brandTitle}>
                  LICENCIAS
                </div>

                <div style={styles.brandSubtitle}>
                  Sistema de gestión
                </div>
              </div>
            </div>
          )}

          {!menuOpen && (
            <div style={styles.logo}>
              LC
            </div>
          )}

        </div>

        {/* Línea decorativa */}
        <div style={styles.divider}></div>

        {/* Menú */}
        <nav style={styles.menu}>

          {menuOpen && (
            <div style={styles.menuTitle}>
              MENÚ PRINCIPAL
            </div>
          )}

          {/* Usuarios */}
          {(usuario.rol === "ADMIN" ||
            usuario.rol === "SUPER_ADMINISTRADOR") && (

            <button
              style={{
                ...styles.menuButton,
                ...(view === "usuarios"
                  ? styles.menuButtonActive
                  : {}),
              }}
              onClick={() => setView("usuarios")}
              title="Usuarios"
            >
              <span style={styles.icon}>👥</span>

              {menuOpen && (
                <span style={styles.buttonText}>
                  Usuarios
                </span>
              )}

              {menuOpen && view === "usuarios" && (
                <span style={styles.activeIndicator}></span>
              )}
            </button>
          )}

          {/* Nueva licencia */}
          <button
            style={{
              ...styles.menuButton,
              ...(view === "ciudadano"
                ? styles.menuButtonActive
                : {}),
            }}
            onClick={() => setView("ciudadano")}
            title="Nueva Licencia"
          >
            <span style={styles.icon}>📄</span>

            {menuOpen && (
              <span style={styles.buttonText}>
                Nueva Licencia
              </span>
            )}

            {menuOpen && view === "ciudadano" && (
              <span style={styles.activeIndicator}></span>
            )}
          </button>

          {/* Registros */}
          <button
            style={{
              ...styles.menuButton,
              ...(view === "registros"
                ? styles.menuButtonActive
                : {}),
            }}
            onClick={() => setView("registros")}
            title="Registros"
          >
            <span style={styles.icon}>📋</span>

            {menuOpen && (
              <span style={styles.buttonText}>
                Registros
              </span>
            )}

            {menuOpen && view === "registros" && (
              <span style={styles.activeIndicator}></span>
            )}
          </button>

        </nav>

        {/* Parte inferior */}
        <div style={styles.sidebarBottom}>

          <div style={styles.divider}></div>

          {/* Usuario */}
          {menuOpen && (
            <div style={styles.userCard}>

              <div style={styles.userAvatar}>
                {usuario?.nombre
                  ? usuario.nombre.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div style={styles.userInfo}>

                <div style={styles.userName}>
                  {usuario?.nombre || "Usuario"}
                </div>

                <div style={styles.userRole}>
                  {usuario?.rol || "Usuario"}
                </div>

              </div>

            </div>
          )}

          {/* Salir */}
          <button
            style={styles.logoutButton}
            onClick={onLogout}
            title="Cerrar sesión"
          >
            <span style={styles.icon}>↪</span>

            {menuOpen && (
              <span style={styles.buttonText}>
                Cerrar sesión
              </span>
            )}
          </button>

        </div>

      </aside>

      {/* ================= CONTENIDO ================= */}
      <main style={styles.main}>

        {/* Barra superior */}
        <header style={styles.topBar}>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={styles.toggleButton}
            title={menuOpen ? "Ocultar menú" : "Mostrar menú"}
          >
            {menuOpen ? "☰" : "☰"}
          </button>

          <div style={styles.pageTitle}>
            {view === "ciudadano" && "Nueva Licencia"}
            {view === "usuarios" && "Usuarios"}
            {view === "registros" && "Registros"}
          </div>

        </header>

        {/* Contenido */}
        <section style={styles.content}>

          {view === "ciudadano" && (
            !ciudadanoId ? (
              <DatosPersonalesForm
                onSaved={setCiudadanoId}
              />
            ) : showLicencia ? (
              <LicenciaPage
                ciudadanoId={ciudadanoId}
              />
            ) : (
              <LicenciaForm
                ciudadanoId={ciudadanoId}
                setShowLicencia={setShowLicencia}
              />
            )
          )}

          {view === "usuarios" &&
            (usuario.rol === "ADMIN" ||
              usuario.rol === "SUPER_ADMINISTRADOR") && (
              <UsuariosPage />
            )}

          {view === "registros" && (
            <RegistrosPage />
          )}

        </section>

      </main>

    </div>
  );
}


/* =====================================================
   ESTILOS
===================================================== */

const styles = {

  /* Dashboard */
  dashboard: {
    display: "flex",
    height: "100vh",
    width: "100%",
    background: "#f8fafc",
    overflow: "hidden",
    fontFamily:
      "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },


  /* ================= SIDEBAR ================= */

  sidebar: {
    height: "100vh",
    flexShrink: 0,

    display: "flex",
    flexDirection: "column",

    background:
      "linear-gradient(180deg, #4c1d95)",

    color: "#ffffff",

    padding: "20px 14px",

    boxSizing: "border-box",

    boxShadow:
      "8px 0 30px rgba(76, 29, 149, 0.15)",

    transition:
      "width 0.3s ease",

    overflow: "hidden",
  },


  /* Encabezado */
  sidebarHeader: {
    minHeight: "64px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "0 6px",
  },


  brandContainer: {
    width: "100%",

    display: "flex",
    alignItems: "center",

    gap: "12px",
  },


  logo: {
    width: "42px",
    height: "42px",

    minWidth: "42px",

    borderRadius: "12px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    background:
      "rgba(255,255,255,0.18)",

    border:
      "1px solid rgba(255,255,255,0.25)",

    color: "#ffffff",

    fontSize: "14px",
    fontWeight: "800",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.12)",
  },


  brandTitle: {
    fontSize: "15px",
    fontWeight: "800",
    letterSpacing: "0.8px",
    whiteSpace: "nowrap",
  },


  brandSubtitle: {
    marginTop: "2px",

    fontSize: "11px",

    color:
      "rgba(255,255,255,0.72)",

    whiteSpace: "nowrap",
  },


  /* Separadores */
  divider: {
    height: "1px",

    width: "100%",

    background:
      "rgba(255,255,255,0.18)",

    margin:
      "14px 0",
  },


  /* Menú */
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },


  menuTitle: {
    padding:
      "4px 12px 10px",

    fontSize: "10px",

    fontWeight: "700",

    letterSpacing: "1.2px",

    color:
      "rgba(255,255,255,0.55)",
  },


  menuButton: {
    position: "relative",

    width: "100%",
    height: "48px",

    display: "flex",
    alignItems: "center",

    gap: "13px",

    padding:
      "0 13px",

    border: "1px solid transparent",

    borderRadius: "12px",

    background:
      "transparent",

    color: "rgba(255,255,255,0.82)",

    cursor: "pointer",

    textAlign: "left",

    fontSize: "14px",

    fontWeight: "500",

    transition:
      "all 0.2s ease",

    whiteSpace: "nowrap",
  },


  menuButtonActive: {
    background:
      "rgba(255,255,255,0.18)",

    border:
      "1px solid rgba(255,255,255,0.20)",

    color: "#ffffff",

    boxShadow:
      "0 8px 20px rgba(76,29,149,0.15)",
  },


  icon: {
    width: "24px",
    minWidth: "24px",

    height: "24px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "17px",
  },


  buttonText: {
    flex: 1,
  },


  activeIndicator: {
    position: "absolute",

    right: "7px",

    width: "5px",
    height: "24px",

    borderRadius: "10px",

    background: "#ffffff",

    boxShadow:
      "0 0 10px rgba(255,255,255,0.7)",
  },


  /* Parte inferior */
  sidebarBottom: {
    marginTop: "auto",
  },


  /* Usuario */
  userCard: {
    display: "flex",
    alignItems: "center",

    gap: "10px",

    padding:
      "10px 9px",

    marginBottom: "8px",

    borderRadius: "12px",

    background:
      "rgba(255,255,255,0.10)",

    border:
      "1px solid rgba(255,255,255,0.12)",
  },


  userAvatar: {
    width: "34px",
    height: "34px",

    minWidth: "34px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "50%",

    background:
      "rgba(255,255,255,0.22)",

    fontSize: "13px",
    fontWeight: "700",
  },


  userInfo: {
    minWidth: 0,
  },


  userName: {
    fontSize: "12px",

    fontWeight: "700",

    overflow: "hidden",

    textOverflow: "ellipsis",

    whiteSpace: "nowrap",
  },


  userRole: {
    marginTop: "2px",

    fontSize: "10px",

    color:
      "rgba(255,255,255,0.65)",

    overflow: "hidden",

    textOverflow: "ellipsis",

    whiteSpace: "nowrap",
  },


  /* Cerrar sesión */
  logoutButton: {
    width: "100%",
    height: "45px",

    display: "flex",
    alignItems: "center",

    gap: "13px",

    padding:
      "0 13px",

    border: "1px solid rgba(255,255,255,0.12)",

    borderRadius: "12px",

    background:
      "rgba(255,255,255,0.08)",

    color:
      "rgba(255,255,255,0.88)",

    cursor: "pointer",

    fontSize: "14px",

    textAlign: "left",

    transition:
      "all 0.2s ease",
  },


  /* ================= MAIN ================= */

  main: {
    flex: 1,

    minWidth: 0,

    height: "100vh",

    display: "flex",
    flexDirection: "column",

    overflow: "hidden",

    background: "#f8fafc",
  },


  /* Barra superior */
  topBar: {
    height: "74px",

    minHeight: "74px",

    display: "flex",
    alignItems: "center",

    gap: "18px",

    padding:
      "0 28px",

    background:
      "rgba(255,255,255,0.95)",

    borderBottom:
      "1px solid #e5e7eb",

    boxShadow:
      "0 2px 12px rgba(15,23,42,0.04)",
  },


  /* Botón menú */
  toggleButton: {
    width: "42px",
    height: "42px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    border: "none",

    borderRadius: "11px",

    background:
      "linear-gradient(135deg, #4c1d95, #7c3aed)",

    color: "#ffffff",

    fontSize: "20px",

    cursor: "pointer",

    boxShadow:
      "0 5px 15px rgba(124,58,237,0.25)",

    transition:
      "all 0.2s ease",
  },


  pageTitle: {
    fontSize: "20px",

    fontWeight: "700",

    color: "#1e293b",
  },


  /* Contenido */
  content: {
    flex: 1,

    overflowY: "auto",

    padding: "30px",
  },
};


export default Dashboard;