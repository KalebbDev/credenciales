import React, { useState } from "react";
import Swal from "sweetalert2";

function DatosPersonalesForm({ onSaved }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    curp: "",
    nacionalidad: "",
    tipoSanguineo: "",
    donador: false,
    alergias: false,
    nacimiento: "",
    telefono: "",
    fotografia: null,
    firma: null,
  });

  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    setGuardando(true);

    try {
      const res = await fetch(
        "http://localhost:3020/api/v1/ciudadanos",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Error al guardar ciudadano"
        );
      }

      await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Los datos personales se guardaron correctamente.",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#7c3aed",
        background: "#ffffff",
        color: "#1e293b",
      });

      onSaved(data.ciudadano._id);
    } catch (err) {
      Swal.fire({
        icon: "error",
        iconColor:"#dc2626",
        title: "Error al guardar",
        text: err.message,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formContainer}>

        {/* ENCABEZADO */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            👤
          </div>

          <div>
            <h2 style={styles.title}>
              Registro de Licencia
            </h2>

            <p style={styles.subtitle}>
               Captura la información correspondiente a los datos personales 
            </p>
          </div>
        </div>

        <div style={styles.divider}></div>

        <form onSubmit={handleSubmit}>

          {/* DATOS PERSONALES */}
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>
              📋
            </div>

            <div>
              <h3 style={styles.sectionTitle}>
                Datos personales
              </h3>

              <p style={styles.sectionDescription}>
                Información básica de identificación
              </p>
            </div>
          </div>

          <div style={styles.grid}>

            {/* NOMBRE */}
            <div style={styles.field}>
              <label style={styles.label}>
                Nombre
                <span style={styles.required}>*</span>
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}></span>

                <input
                  style={styles.input}
                  name="nombre"
                  placeholder="Nombre(s)"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* APELLIDO PATERNO */}
            <div style={styles.field}>
              <label style={styles.label}>
                Apellido paterno
                <span style={styles.required}>*</span>
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}></span>

                <input
                  style={styles.input}
                  name="apellidoPaterno"
                  placeholder="Apellido paterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* APELLIDO MATERNO */}
            <div style={styles.field}>
              <label style={styles.label}>
                Apellido materno
                <span style={styles.required}>*</span>
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}></span>

                <input
                  style={styles.input}
                  name="apellidoMaterno"
                  placeholder="Apellido materno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* CURP */}
            <div style={styles.field}>
              <label style={styles.label}>
                CURP
                <span style={styles.required}>*</span>
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}></span>

                <input
                  style={styles.input}
                  name="curp"
                  placeholder="CURP"
                  value={formData.curp}
                  onChange={handleChange}
                  maxLength={18}
                  required
                />
              </div>
            </div>

            {/* NACIONALIDAD */}
            <div style={styles.field}>
              <label style={styles.label}>
                Nacionalidad
                <span style={styles.required}>*</span>
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}></span>

                <select
                  style={styles.inputSelect}
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleChange}
                  required
                >
                <option value="">
                    Seleccione una nacionalidad
                  </option>

                  <option value="Mexicana">Mexicana</option>
                  <option value="Extranjera">Extranjera</option>
                </select>

              </div>
            </div>


            {/* TIPO SANGUÍNEO */}
            <div style={styles.field}>
              <label style={styles.label}>
                Tipo sanguíneo
                <span style={styles.required}>*</span>
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}></span>

                <select
                  style={styles.inputSelect}
                  name="tipoSanguineo"
                  value={formData.tipoSanguineo}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Seleccione tipo sanguíneo
                  </option>

                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            {/* FECHA NACIMIENTO */}
            <div style={styles.field}>
              <label style={styles.label}>
                Fecha de nacimiento
                <span style={styles.required}>*</span>
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}></span>

                <input
                  style={styles.input}
                  name="nacimiento"
                  type="date"
                  value={formData.nacimiento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* TELÉFONO */}
            <div style={styles.field}>
              <label style={styles.label}>
                Teléfono
                <span style={styles.required}>*</span>
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}></span>

                <input
                  style={styles.input}
                  name="telefono"
                  type="tel"
                  placeholder="Ingresa el teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* INFORMACIÓN ADICIONAL */}
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>
              ❤️
            </div>

            <div>
              <h3 style={styles.sectionTitle}>
                Información adicional
              </h3>

              <p style={styles.sectionDescription}>
                Información médica y de asistencia
              </p>
            </div>
          </div>

          <div style={styles.optionsContainer}>

            {/* DONADOR */}
            <label
              style={{
                ...styles.optionCard,
                ...(formData.donador
                  ? styles.optionCardActive
                  : {}),
              }}
            >
              <input
                type="checkbox"
                name="donador"
                checked={formData.donador}
                onChange={handleChange}
                style={styles.checkboxInput}
              />

              <div
                style={{
                  ...styles.checkboxCustom,
                  ...(formData.donador
                    ? styles.checkboxCustomActive
                    : {}),
                }}
              >
                {formData.donador && "✓"}
              </div>

              <div>
                <strong style={styles.optionTitle}>
                  Donador
                </strong>

                <span style={styles.optionText}>
                  Es donador de sangre
                </span>
              </div>
            </label>

            {/* ALERGIAS */}
            <label
              style={{
                ...styles.optionCard,
                ...(formData.alergias
                  ? styles.optionCardActive
                  : {}),
              }}
            >
              <input
                type="checkbox"
                name="alergias"
                checked={formData.alergias}
                onChange={handleChange}
                style={styles.checkboxInput}
              />

              <div
                style={{
                  ...styles.checkboxCustom,
                  ...(formData.alergias
                    ? styles.checkboxCustomActive
                    : {}),
                }}
              >
                {formData.alergias && "✓"}
              </div>

              <div>
                <strong style={styles.optionTitle}>
                  Alergias
                </strong>

                <span style={styles.optionText}>
                  Presenta algún tipo de alergia
                </span>
              </div>
            </label>
          </div>

          {/* ARCHIVOS */}
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>
              📎
            </div>

            <div>
              <h3 style={styles.sectionTitle}>
                Documentación
              </h3>

              <p style={styles.sectionDescription}>
                Carga la fotografía y firma del ciudadano
              </p>
            </div>
          </div>

          <div style={styles.filesGrid}>

            {/* FOTOGRAFÍA */}
            <label style={styles.fileCard}>
              

              <div style={styles.fileContent}>
                <span style={styles.fileTitle}>
                  Fotografía
                </span>

                <span style={styles.fileDescription}>
                  Selecciona una imagen
                </span>

                <input
                  type="file"
                  name="fotografia"
                  accept="image/*"
                  onChange={handleChange}
                  style={styles.fileInput}
                />

                {formData.fotografia && (
                  <span style={styles.fileSelected}>
                    ✓ {formData.fotografia.name}
                  </span>
                )}
              </div>
            </label>

            {/* FIRMA */}
            <label style={styles.fileCard}>
              

              <div style={styles.fileContent}>
                <span style={styles.fileTitle}>
                  Firma
                </span>

                <span style={styles.fileDescription}>
                  Selecciona una imagen
                </span>

                <input
                  type="file"
                  name="firma"
                  accept="image/*"
                  onChange={handleChange}
                  style={styles.fileInput}
                />

                {formData.firma && (
                  <span style={styles.fileSelected}>
                    ✓ {formData.firma.name}
                  </span>
                )}
              </div>
            </label>
          </div>

          {/* BOTÓN */}
          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={{
                ...styles.button,
                ...(guardando
                  ? styles.buttonDisabled
                  : {}),
              }}
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span style={styles.spinner}></span>
                  Guardando...
                </>
              ) : (
                <>
                  Guardar y continuar
                  <span style={styles.arrow}>→</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100%",
    padding: "35px",
    background:
      "linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%)",
    boxSizing: "border-box",
  },

  formContainer: {
    maxWidth: "950px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "35px",
    boxShadow:
      "0 15px 45px rgba(76, 29, 149, 0.12)",
    border: "1px solid #ede9fe",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "25px",
  },

  headerIcon: {
    width: "58px",
    height: "58px",
    minWidth: "58px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, #4c1d95 0%, #7c3aed 45%, #a5b4fc 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    boxShadow:
      "0 8px 20px rgba(124, 58, 237, 0.25)",
  },

  title: {
    margin: 0,
    color: "#1e1b4b",
    fontSize: "27px",
    fontWeight: "750",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  divider: {
    height: "1px",
    background: "#ede9fe",
    marginBottom: "30px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "28px",
    marginBottom: "20px",
  },

  sectionIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "#f3e8ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color: "#312e81",
  },

  sectionDescription: {
    margin: "3px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "650",
    color: "#334155",
  },

  required: {
    color: "#7c3aed",
    marginLeft: "3px",
  },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    left: "13px",
    fontSize: "16px",
    zIndex: 1,
  },

  input: {
    width: "100%",
    height: "46px",
    boxSizing: "border-box",
    padding: "0 14px 0 42px",
    border: "1px solid #ddd6fe",
    borderRadius: "11px",
    outline: "none",
    fontSize: "14px",
    color: "#1e293b",
    background: "#fafafa",
    transition: "all 0.2s ease",
  },

  inputSelect: {
    width: "100%",
    height: "46px",
    boxSizing: "border-box",
    padding: "0 14px 0 42px",
    border: "1px solid #ddd6fe",
    borderRadius: "11px",
    outline: "none",
    fontSize: "14px",
    color: "#1e293b",
    background: "#fafafa",
    cursor: "pointer",
  },

  optionsContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "15px",
  },

  optionCard: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "16px",
    borderRadius: "13px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  optionCardActive: {
    border: "1px solid #a78bfa",
    background: "#faf5ff",
  },

  checkboxInput: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
  },

  checkboxCustom: {
    width: "22px",
    height: "22px",
    minWidth: "22px",
    borderRadius: "7px",
    border: "2px solid #cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  },

  checkboxCustomActive: {
    background: "#7c3aed",
    borderColor: "#7c3aed",
  },

  optionTitle: {
    display: "block",
    color: "#334155",
    fontSize: "14px",
  },

  optionText: {
    display: "block",
    marginTop: "2px",
    color: "#94a3b8",
    fontSize: "12px",
  },

  filesGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "15px",
  },

  fileCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "18px",
    border: "1px dashed #c4b5fd",
    borderRadius: "14px",
    background: "#faf5ff",
    cursor: "pointer",
  },

  fileIcon: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    borderRadius: "12px",
    background: "#ede9fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  fileContent: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },

  fileTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#312e81",
  },

  fileDescription: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "2px",
  },

  fileInput: {
    marginTop: "8px",
    fontSize: "12px",
    maxWidth: "100%",
  },

  fileSelected: {
    marginTop: "5px",
    color: "#7c3aed",
    fontSize: "11px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "32px",
    paddingTop: "22px",
    borderTop: "1px solid #f1f5f9",
  },

  button: {
    minWidth: "220px",
    height: "48px",
    padding: "0 24px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #4c1d95 0%, #7c3aed 45%, #a5b4fc 100%)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow:
      "0 8px 18px rgba(124, 58, 237, 0.25)",
    transition: "all 0.2s ease",
  },

  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  arrow: {
    fontSize: "20px",
    lineHeight: 1,
  },

  spinner: {
    width: "17px",
    height: "17px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTop: "2px solid #ffffff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.8s linear infinite",
  },
};

export default DatosPersonalesForm;