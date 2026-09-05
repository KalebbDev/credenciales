import React, { useState } from "react";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    if (name === "expedida" || name === "periodo") {
      if (updatedForm.expedida) {
        const fechaExpedida = new Date(updatedForm.expedida);
        const años = parseInt(updatedForm.periodo, 10);
        fechaExpedida.setFullYear(fechaExpedida.getFullYear() + años);
        updatedForm.vencimiento = fechaExpedida.toISOString().split("T")[0];
      }
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3020/api/v1/licencias/${ciudadanoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al guardar licencia");

      alert("✅ Licencia guardada correctamente");
      setShowLicencia(true);   // 👈 activa la pantalla de LicenciaPage
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Registro de Licencia</h2>

      <div style={styles.grid}>
        <label>
          Antigüedad
          <input style={styles.input} name="antiguedad" type="date" value={formData.antiguedad} onChange={handleChange} />
        </label>

        <label>
          Expedida
          <input style={styles.input} name="expedida" type="date" value={formData.expedida} onChange={handleChange} />
        </label>

        <label>
          Periodo
          <select style={styles.input} name="periodo" value={formData.periodo} onChange={handleChange}>
            <option value="2">2 años</option>
            <option value="5">5 años</option>
          </select>
        </label>

        <label>
          Vencimiento
          <input style={styles.input} name="vencimiento" type="date" value={formData.vencimiento} readOnly />
        </label>

        <label>
          Tipo
          <input style={styles.input} name="tipo" placeholder="Tipo (A/B/C/D)" onChange={handleChange} />
        </label>

        <label>
          Matrícula
          <input style={styles.input} name="matricula" placeholder="Matrícula" onChange={handleChange} />
        </label>

        <label>
          Nombre tipo
          <input style={styles.input} name="nombreTipo" placeholder="Ej. Motociclista" onChange={handleChange} />
        </label>

        <label>
          Folio
          <input style={styles.input} name="folio" placeholder="Folio" onChange={handleChange} />
        </label>
      </div>

      <button type="submit" style={styles.button}>Guardar Licencia ✅</button>
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
    marginTop: "5px",
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

export default LicenciaForm;
