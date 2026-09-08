import React, { useState } from "react";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Login = ({ onLogin }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");

  //inicio de sesion
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validación de campos
    if (!correo.trim() || !contrasena.trim()) {
      const mensaje =
        "Por favor, ingresa tu correo electrónico y contraseña.";

      setError(mensaje);

      Swal.fire({
        icon: "warning",
        iconColor: "#dc2626 ",
        title: "Campos incompletos",
        text: mensaje,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#7c3aed",
      });

      return;
    }

    setLoading(true);

    try {
      // conexion con el backend
      const res = await fetch(
        "http://localhost:3020/api/v1/usuarios/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            correo,
            contrasena,
          }),
        }
      );

      const data = await res.json();

      // valida respuesta
      if (!res.ok) {
        throw new Error(
          data.message || "Error al iniciar sesión"
        );
      }

      // guarda la sesión

      localStorage.setItem(
        "token",
        data.data.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(data.data.usuario)
      );

     
      await Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Inicio de sesión exitoso.",
        /*confirmButtonText: "Continuar",
        confirmButtonColor: "#7c3aed",*/
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });

      //continua

      onLogin(data.data.usuario);

    } catch (err) {
      const mensaje =
        err.message ||
        "No se pudo iniciar sesión.";

      setError(mensaje);

     

      Swal.fire({
        icon: "error",
        iconColor: "#dc3545",
        title: "No se pudo iniciar sesión",
        text: mensaje,
        confirmButtonText: "Intentar nuevamente",
        confirmButtonColor: "#7c3aed",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* =====================================================
          ESTILOS
      ===================================================== */}

      <style>{`

        /* ==========================================
           CONTENEDOR PRINCIPAL
        ========================================== */

        .login-container {
          min-height: 100vh;
          width: 100%;

          display: flex;
          justify-content: center;
          align-items: center;

          padding: 30px;

          background:
            linear-gradient(
              135deg,
           #4c1d95 0%,
#7c3aed 45%,
#a5b4fc 100%
            );
        }


        /* ==========================================
           TARJETA
        ========================================== */

        .login-card {
          width: 100%;
          max-width: 950px;
          min-height: 560px;

          display: flex;

          background: #ffffff;

          border-radius: 22px;

          overflow: hidden;

          box-shadow:
            0 25px 60px rgba(0, 0, 0, 0.35);
        }


        /* ==========================================
           PANEL IZQUIERDO
        ========================================== */

        .login-brand {
          width: 45%;

          display: flex;
          flex-direction: column;

          justify-content: center;
          align-items: center;

          padding: 50px;

          text-align: center;

          color: #ffffff;

          background:
            linear-gradient(
              160deg,
              #a78bfa  0%,
              #7c3aed 45%,
              #5b21b6 100%
            );
        }

        /* ==========================================
           ICONO PRINCIPAL
        ========================================== */

        .brand-icon {
          width: 105px;
          height: 105px;

          display: flex;

          justify-content: center;
          align-items: center;

          margin-bottom: 25px;

          border-radius: 50%;

          background:
            rgba(255, 255, 255, 0.12);

          border:
            2px solid rgba(255, 255, 255, 0.35);

          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.25);
        }


        .brand-icon i {
          font-size: 48px;
        }


        /* ==========================================
           TÍTULO DEL SISTEMA
        ========================================== */

        .login-brand h1 {
          font-size: 25px;

          font-weight: 700;

          letter-spacing: 1px;

          margin-bottom: 18px;
        }


        .login-brand p {
          max-width: 330px;

          font-size: 15px;

          line-height: 1.7;

          opacity: 0.9;
        }


        .brand-line {
          width: 70px;
          height: 3px;

          margin: 20px 0;

          border-radius: 10px;

          background: #ffffff;
        }


        .login-brand small {
          opacity: 0.85;
        }


        /* ==========================================
           PANEL DERECHO
        ========================================== */

        .login-form-container {
          width: 55%;

          display: flex;

          flex-direction: column;

          justify-content: center;

          padding: 55px 65px;
        }


        /* ==========================================
           ENCABEZADO
        ========================================== */

        .login-header {
          text-align: center;

          margin-bottom: 35px;
        }


        .login-icon {
          width: 65px;
          height: 65px;

          display: flex;

          justify-content: center;
          align-items: center;

          margin: 0 auto 15px;

          border-radius: 50%;

          background: #e8f5e9;

          color: #7c3aed;
        }


        .login-icon i {
          font-size: 30px;
        }


        .login-header h2 {
          font-size: 28px;

          font-weight: 700;

          color: #1e293b;

          margin-bottom: 8px;
        }


        .login-header p {
          margin: 0;

          color: #475569;

          font-size: 14px;
        }


        /* ==========================================
           LABELS
        ========================================== */

        .login-form-container .form-label {
          display: block;

          font-weight: 600;

          color: #1e293b;

          font-size: 14px;

          margin-bottom: 8px;
        }


        /* ==========================================
           INPUTS
        ========================================== */

        .custom-input {
          min-height: 50px;
        }


        .custom-input .input-group-text {
          min-width: 52px;

          display: flex;

          justify-content: center;
          align-items: center;

          background: #f8fafc;

          border:
            1px solid #cbd5e1;

          color: #7c3aed;
        }


        .custom-input .input-group-text i {
          font-size: 18px;
        }


        .custom-input .form-control {
          min-height: 50px;

          border:
            1px solid #cbd5e1;

          border-left: none;

          box-shadow: none;

          color: #1e293b;

          font-size: 15px;
        }


        .custom-input
        .form-control::placeholder {
          color: #64748b;

          opacity: 1;
        }


        /* ==========================================
           FOCO DE LOS CAMPOS
        ========================================== */

        .custom-input
        .form-control:focus {

          border-color: #7c3aed;

          box-shadow:
            0 0 0 0.25rem
            rgba(124, 58, 237, 0.25);
        }


        .custom-input:focus-within
        .input-group-text {

          border-color: #7c3aed;

          color: #7c3aed;
        }


        /* ==========================================
           BOTÓN MOSTRAR CONTRASEÑA
        ========================================== */

        .password-toggle {

          min-width: 52px;

          display: flex;

          justify-content: center;
          align-items: center;

          background: #ffffff;

          border:
            1px solid #cbd5e1;

          border-left: none;

          color: #334155;
        }


        .password-toggle i {
          font-size: 18px;
        }


        .password-toggle:hover {

          color: #7c3aed;

          background: #f8fafc;
        }


        .password-toggle:focus-visible {

          position: relative;

          z-index: 2;

          outline:
            3px solid
            rgba(13, 110, 253, 0.45);

          outline-offset: 2px;
        }


        /* ==========================================
           MENSAJE DE ERROR
        ========================================== */

        .login-error {

          min-height: 24px;

          display: flex;

          align-items: flex-start;

          gap: 8px;

          margin-bottom: 12px;

          color: #b02a37;

          font-size: 14px;

          font-weight: 500;
        }


        .login-error i {
          flex-shrink: 0;

          margin-top: 2px;
        }


        /* ==========================================
           BOTÓN LOGIN
        ========================================== */

        .btn-login {

          min-height: 52px;

          border: none;

          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #4c1d95,
              #7c3aed
            );

          color: #ffffff;

          font-weight: 600;

          font-size: 15px;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;

          box-shadow:
            0 6px 15px
            rgba(124, 58, 237, 0.25);
        }


        .btn-login:hover:not(:disabled) {

          transform: translateY(-2px);

          box-shadow:
            0 10px 20px
            rgba(124, 58, 237, 0.25);

          color: #ffffff;
        }


        .btn-login:focus-visible {

          outline:
            3px solid #0d6efd;

          outline-offset: 3px;
        }


        .btn-login:disabled {

          opacity: 0.7;

          cursor: not-allowed;
        }


        /* ==========================================
           FOOTER
        ========================================== */

        .login-footer {

          display: flex;

          justify-content: center;

          align-items: center;

          margin-top: 30px;

          padding-top: 20px;

          border-top:
            1px solid #e2e8f0;

          color: #475569;

          font-size: 12px;

          text-align: center;
        }


        /* ==========================================
           REDUCIR ANIMACIONES
        ========================================== */

        @media
        (prefers-reduced-motion: reduce) {

          .btn-login {

            transition: none;
          }

          .btn-login:hover:not(:disabled) {

            transform: none;
          }
        }


        /* ==========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 768px) {

          .login-container {

            padding: 15px;
          }


          .login-card {

            max-width: 450px;

            flex-direction: column;
          }


          .login-brand {

            width: 100%;

            min-height: 260px;

            padding: 30px;
          }


          .brand-icon {

            width: 75px;
            height: 75px;
          }


          .brand-icon i {

            font-size: 35px;
          }


          .login-brand h1 {

            font-size: 20px;
          }


          .login-brand p {

            display: none;
          }


          .brand-line {

            margin: 10px 0;
          }


          .login-form-container {

            width: 100%;

            padding: 40px 30px;
          }
        }


        /* ==========================================
           PANTALLAS MUY PEQUEÑAS
        ========================================== */

        @media (max-width: 400px) {

          .login-container {

            padding: 10px;
          }


          .login-brand {

            min-height: 220px;

            padding: 20px;
          }


          .login-form-container {

            padding: 30px 20px;
          }


          .login-header h2 {

            font-size: 24px;
          }
        }

      `}</style>


      {/* =====================================================
          CONTENEDOR
      ===================================================== */}

      <main className="login-container">

        <div className="login-card">


          {/* =================================================
              PANEL IZQUIERDO
          ================================================= */}

          <section
            className="login-brand"
            aria-label="Información del sistema"
          >

            <div
              className="brand-icon"
              aria-hidden="true"
            >

              <i className="bi bi-shield-lock-fill"></i>

            </div>


            <h1>
              CONTROL DE LICENCIAS
            </h1>


            <p>
              Sistema web para la gestión y
              control de licencias.
            </p>


            <div
              className="brand-line"
              aria-hidden="true"
            ></div>



          </section>


          {/* =================================================
              FORMULARIO
          ================================================= */}

          <section className="login-form-container">


            <div className="login-header">

              <div
                className="login-icon"
                aria-hidden="true"
              >

                <i className="bi bi-person-fill"></i>

              </div>


              <h2 id="login-title">
                Iniciar sesión
              </h2>


              <p id="login-description">
                Ingresa tu para continuar
              </p>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              aria-labelledby="login-title"
              aria-describedby="login-description"
              noValidate
            >


              {/* ===============================================
                  CORREO
              =============================================== */}

              <div className="mb-3">

                <label
                  htmlFor="correo"
                  className="form-label"
                >
                  Correo electrónico
                </label>


                <div className="input-group custom-input">


                  <span
                    className="input-group-text"
                    aria-hidden="true"
                  >

                    <i className="bi bi-envelope-fill"></i>

                  </span>


                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    className="form-control"
                    placeholder="correo@ejemplo.com"

                    value={correo}

                    onChange={(e) =>
                      setCorreo(e.target.value)
                    }

                    autoComplete="username"
                    inputMode="email"

                    aria-required="true"

                    disabled={loading}

                    required
                  />

                </div>

              </div>


              {/* ===============================================
                  CONTRASEÑA
              =============================================== */}

              <div className="mb-4">

                <label
                  htmlFor="contrasena"
                  className="form-label"
                >
                  Contraseña
                </label>


                <div className="input-group custom-input">


                  <span
                    className="input-group-text"
                    aria-hidden="true"
                  >

                    <i className="bi bi-lock-fill"></i>

                  </span>


                  <input
                    id="contrasena"
                    name="contrasena"

                    type={
                      mostrarPassword
                        ? "text"
                        : "password"
                    }

                    className="form-control"

                    placeholder="Ingresa tu contraseña"

                    value={contrasena}

                    onChange={(e) =>
                      setPassword(e.target.value)
                    }

                    autoComplete="current-password"

                    aria-required="true"

                    disabled={loading}

                    required
                  />


                  {/* ==========================================
                      MOSTRAR / OCULTAR PASSWORD
                  ========================================== */}

                  <button
                    type="button"

                    className="btn password-toggle"

                    onClick={() =>
                      setMostrarPassword(
                        !mostrarPassword
                      )
                    }

                    disabled={loading}

                    aria-label={
                      mostrarPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }

                    aria-pressed={
                      mostrarPassword
                    }
                  >

                    <i
                      className={
                        mostrarPassword
                          ? "bi bi-eye-slash-fill"
                          : "bi bi-eye-fill"
                      }

                      aria-hidden="true"
                    ></i>

                  </button>

                </div>

              </div>


              {/* ===============================================
                  MENSAJE DE ERROR
              =============================================== */}

              <div
                className="login-error"

                role="alert"

                aria-live="assertive"

                aria-atomic="true"
              >

                {error && (
                  <>

                    <i
                      className="bi bi-exclamation-circle-fill"
                      aria-hidden="true"
                    ></i>

                    <span>
                      {error}
                    </span>

                  </>
                )}

              </div>


              {/* ===============================================
                  BOTÓN INGRESAR
              =============================================== */}

              <button
                type="submit"

                className="btn btn-login w-100"

                disabled={loading}

                aria-disabled={loading}
              >

                {loading ? (

                  <>

                    <span
                      className="spinner-border spinner-border-sm me-2"

                      role="status"

                      aria-hidden="true"
                    ></span>

                    <span>
                      Verificando credenciales...
                    </span>

                  </>

                ) : (

                  <>

                    <i
                      className="bi bi-box-arrow-in-right me-2"

                      aria-hidden="true"
                    ></i>

                    <span>
                      Ingresar al sistema
                    </span>

                  </>

                )}

              </button>

            </form>


            {/* =================================================
                PIE
            ================================================= */}

            <div className="login-footer">

              <i
                className="bi bi-shield-check me-1"
                aria-hidden="true"
              ></i>

              <span>
                Acceso exclusivo para personal autorizado
              </span>

            </div>

          </section>

        </div>

      </main>
    </>
  );
};

export default Login;
