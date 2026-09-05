import React, { useState } from "react";

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

    try {
      const res = await fetch("http://localhost:3020/api/v1/ciudadanos", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al guardar ciudadano");

      alert("✅ Datos personales guardados correctamente");
      onSaved(data.ciudadano._id);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Registro de Ciudadano</h2>

      <div style={styles.grid}>
        <input style={styles.input} name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input style={styles.input} name="apellidoPaterno" placeholder="Apellido Paterno" onChange={handleChange} />
        <input style={styles.input} name="apellidoMaterno" placeholder="Apellido Materno" onChange={handleChange} />
        <input style={styles.input} name="curp" placeholder="CURP" onChange={handleChange} />
        <input style={styles.input} name="nacionalidad" placeholder="Nacionalidad" onChange={handleChange} />
        <select style={styles.input} name="tipoSanguineo" onChange={handleChange}>
          <option value="">Seleccione tipo sanguíneo</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
        <input style={styles.input} name="nacimiento" type="date" onChange={handleChange} />
        <input style={styles.input} name="telefono" placeholder="Teléfono" onChange={handleChange} />
      </div>

      <div style={styles.section}>
        <label style={styles.checkbox}>
          <input type="checkbox" name="donador" onChange={handleChange} /> Donador
        </label>
        <label style={styles.checkbox}>
          <input type="checkbox" name="alergias" onChange={handleChange} /> Alergias
        </label>
      </div>

      <div style={styles.section}>
        <label style={styles.file}>
          Fotografía <input type="file" name="fotografia" accept="image/*" onChange={handleChange} />
        </label>
        <label style={styles.file}>
          Firma <input type="file" name="firma" accept="image/*" onChange={handleChange} />
        </label>
      </div>

      <button type="submit" style={styles.button}>Siguiente ➡️</button>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: "700px",
    margin: "0 auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#1e293b",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    width: "100%",
  },
  section: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
  },
  checkbox: {
    fontSize: "0.95rem",
    color: "#334155",
  },
  file: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.95rem",
    color: "#334155",
  },
  button: {
    marginTop: "30px",
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default DatosPersonalesForm;
