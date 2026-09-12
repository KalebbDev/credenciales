import React, { useState } from "react";
import Swal from "sweetalert2";

function LicenciaForm({ ciudadanoId, setShowLicencia }) {
  const [formData, setFormData] = useState({
    antiguedad: "",
    expedida: "",
    vencimiento: "",
    tipo: "",
    matricula: "",
    nombreTipo: "",
    folio: "",
    periodo: "2",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedForm = {
      ...formData,
      [name]: value,
    };

    // Calcular automáticamente la fecha de vencimiento
    if (name === "expedida" || name === "periodo") {
      if (updatedForm.expedida) {
        const fechaExpedida = new Date(updatedForm.expedida);
        const años = parseInt(updatedForm.periodo, 10);

        if (!isNaN(años)) {
          fechaExpedida.setFullYear(
            fechaExpedida.getFullYear() + años
          );

          updatedForm.vencimiento = fechaExpedida
            .toISOString()
            .split("T")[0];
        }
      }
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (
      !formData.antiguedad ||
      !formData.expedida ||
      !formData.tipo ||
      !formData.matricula ||
      !formData.nombreTipo ||
      !formData.folio
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos obligatorios.",
        confirmButtonColor: "#7c3aed",
      });

      return;
    }

    const token = localStorage.getItem("token");

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3020/api/v1/licencias/${ciudadanoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Error al guardar licencia"
        );
      }

      await Swal.fire({
        icon: "success",
        title: "¡Licencia registrada!",
        text: "La licencia se guardó correctamente.",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "Continuar",
      });

      setShowLicencia(true);
    } catch (err) {
      Swal.fire({
        icon: "error",
        iconColor:  "#dc2626",
        title: "Error",
        text: err.message,
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-9">

          {/* TARJETA PRINCIPAL */}
          <div
            className="card border-0 shadow-lg"
            style={{
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >

            {/* ENCABEZADO */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, #4c1d95 0%, #7c3aed 55%, #a78bfa 100%)",
                padding: "28px 32px",
                color: "#fff",
              }}
            >
              <div className="d-flex align-items-center gap-3">

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "15px",
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(5px)",
                  }}
                >
                  <i
                    className="bi bi-card-checklist"
                    style={{ fontSize: "1.7rem" }}
                  ></i>
                </div>

                <div>
                  <h2
                    className="mb-1 fw-bold"
                    style={{ fontSize: "1.5rem" }}
                  >
                    Registro de Licencia
                  </h2>

                  <p
                    className="mb-0"
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Captura la información correspondiente a la licencia
                  </p>
                </div>

              </div>
            </div>

            {/* CUERPO */}
            <div className="card-body p-4 p-md-5">

              <form onSubmit={handleSubmit}>

                {/* SECCIÓN 1 */}
                <div className="mb-4">

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "rgba(124, 58, 237, 0.12)",
                        color: "#7c3aed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="bi bi-calendar3"></i>
                    </div>

                    <div>
                      <h5
                        className="mb-0 fw-bold"
                        style={{ color: "#334155" }}
                      >
                        Vigencia de la licencia
                      </h5>

                      <small className="text-muted">
                        Fechas y periodo de vigencia
                      </small>
                    </div>
                  </div>

                  <div className="row g-4">

                    {/* ANTIGÜEDAD */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Antigüedad
                      </label>

                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            background: "#f5f3ff",
                            color: "#7c3aed",
                            borderColor: "#ddd6fe",
                          }}
                        >
                          <i className="bi bi-calendar-event"></i>
                        </span>

                        <input
                          type="date"
                          className="form-control"
                          name="antiguedad"
                          value={formData.antiguedad}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* EXPEDIDA */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Fecha de expedición
                      </label>

                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            background: "#f5f3ff",
                            color: "#7c3aed",
                            borderColor: "#ddd6fe",
                          }}
                        >
                          <i className="bi bi-calendar-plus"></i>
                        </span>

                        <input
                          type="date"
                          className="form-control"
                          name="expedida"
                          value={formData.expedida}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* PERIODO */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Periodo de vigencia
                      </label>

                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            background: "#f5f3ff",
                            color: "#7c3aed",
                            borderColor: "#ddd6fe",
                          }}
                        >
                          <i className="bi bi-hourglass-split"></i>
                        </span>

                        <select
                          className="form-select"
                          name="periodo"
                          value={formData.periodo}
                          onChange={handleChange}
                        >
                          <option value="2">2 años</option>
                          <option value="5">5 años</option>
                        </select>
                      </div>
                    </div>

                    {/* VENCIMIENTO */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Fecha de vencimiento
                      </label>

                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            background: "#f1f5f9",
                            color: "#64748b",
                            borderColor: "#cbd5e1",
                          }}
                        >
                          <i className="bi bi-calendar-x"></i>
                        </span>

                        <input
                          type="date"
                          className="form-control"
                          name="vencimiento"
                          value={formData.vencimiento}
                          readOnly
                          style={{
                            backgroundColor: "#f8fafc",
                            cursor: "not-allowed",
                          }}
                        />
                      </div>

                      <small className="text-muted">
                        Se calcula automáticamente.
                      </small>
                    </div>

                  </div>
                </div>

                <hr className="my-4" />

                {/* SECCIÓN 2 */}
                <div className="mb-4">

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "rgba(124, 58, 237, 0.12)",
                        color: "#7c3aed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="bi bi-person-vcard"></i>
                    </div>

                    <div>
                      <h5
                        className="mb-0 fw-bold"
                        style={{ color: "#334155" }}
                      >
                        Datos de la licencia
                      </h5>

                      <small className="text-muted">
                        Información identificativa del documento
                      </small>
                    </div>
                  </div>

                  <div className="row g-4">

                    {/* TIPO */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Tipo de licencia
                      </label>

                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            background: "#f5f3ff",
                            color: "#7c3aed",
                            borderColor: "#ddd6fe",
                          }}
                        >
                          <i className="bi bi-tag"></i>
                        </span>

                        <select
        
                          className="form-control"
                          name="tipo"
                    
                          value={formData.tipo}
                          onChange={handleChange}
                          required
                        >   <option value="">
                    Seleccione tipo de licencia
                  </option>

                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                
                </select>

                      </div>
                    </div>

                    {/* MATRÍCULA */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Matrícula
                      </label>

                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            background: "#f5f3ff",
                            color: "#7c3aed",
                            borderColor: "#ddd6fe",
                          }}
                        >
                          <i className="bi bi-upc-scan"></i>
                        </span>

                        <input
                          type="text"
                          className="form-control"
                          name="matricula"
                          placeholder="Ingresa la matrícula"
                          value={formData.matricula}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* NOMBRE TIPO */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Nombre del tipo
                      </label>

                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            background: "#f5f3ff",
                            color: "#7c3aed",
                            borderColor: "#ddd6fe",
                          }}
                        >
                          <i className="bi bi-card-text"></i>
                        </span>

                        <select
                          
                          className="form-control"
                          name="nombreTipo"
                          placeholder="Ej. Motociclista"
                          value={formData.nombreTipo}
                          onChange={handleChange}
                          required
                        >
                           <option value="">
                    Seleccione nombre de licencia
                  </option>

                  <option value="CHOFER">CHOFER PARTICULAR</option>
                  <option value="AUTOMOVILISTA">AUTOMOVILISTA</option>
                  <option value="MOTOCICLISTA">MOTOCICLISTA</option>
                
           

                        </select>
                      </div>
                    </div>

                    {/* FOLIO */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Folio
                      </label>

                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            background: "#f5f3ff",
                            color: "#7c3aed",
                            borderColor: "#ddd6fe",
                          }}
                        >
                          <i className="bi bi-file-earmark-text"></i>
                        </span>

                        <input
                          type="text"
                          className="form-control"
                          name="folio"
                          placeholder="Ingresa el folio"
                          value={formData.folio}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                  </div>
                </div>

               

                {/* BOTÓN */}
                <div className="d-flex justify-content-end">

                  <button
                    type="submit"
                    className="btn px-5 py-3 fw-semibold"
                    disabled={loading}
                    style={{
                      background:
                        "linear-gradient(135deg, #6d28d9, #7c3aed)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow:
                        "0 5px 15px rgba(124, 58, 237, 0.25)",
                      minWidth: "210px",
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Guardar licencia
                      </>
                    )}
                  </button>

                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LicenciaForm;