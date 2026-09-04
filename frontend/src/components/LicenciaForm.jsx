import React, { useState } from "react";

function LicenciaForm({ ciudadanoId }) {
  const [formData, setFormData] = useState({
    antiguedad: "",
    expedida: "",
    vencimiento: "",
    tipo: "",
    matricula: "",
    nombreTipo: "",
    folio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="antiguedad" type="date" onChange={handleChange} />
      <input name="expedida" type="date" onChange={handleChange} />
      <input name="vencimiento" type="date" onChange={handleChange} />
      <input name="tipo" placeholder="Tipo (A/B/C/D)" onChange={handleChange} />
      <input name="matricula" placeholder="Matrícula" onChange={handleChange} />
      <input name="nombreTipo" placeholder="Nombre tipo" onChange={handleChange} />
      <input name="folio" placeholder="Folio" onChange={handleChange} />
      <button type="submit">Guardar Licencia</button>
    </form>
  );
}

export default LicenciaForm;
