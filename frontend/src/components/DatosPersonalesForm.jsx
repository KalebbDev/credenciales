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
    console.log("Token usado:", token);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const res = await fetch("http://localhost:3020/api/v1/ciudadanos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
          // ❌ NO pongas Content-Type, fetch lo maneja solo con FormData
        },
        body: formDataToSend, // ✅ aquí sí mandamos FormData
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
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} />
      <input name="apellidoPaterno" placeholder="Apellido Paterno" onChange={handleChange} />
      <input name="apellidoMaterno" placeholder="Apellido Materno" onChange={handleChange} />
      <input name="curp" placeholder="CURP" onChange={handleChange} />
      <input name="nacionalidad" placeholder="Nacionalidad" onChange={handleChange} />
      <select name="tipoSanguineo" onChange={handleChange}>
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
      <label>
        Donador <input type="checkbox" name="donador" onChange={handleChange} />
      </label>
      <label>
        Alergias <input type="checkbox" name="alergias" onChange={handleChange} />
      </label>
      <input name="nacimiento" type="date" onChange={handleChange} />
      <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
      <label>
        Fotografía <input type="file" name="fotografia" accept="image/*" onChange={handleChange} />
      </label>
      <label>
        Firma <input type="file" name="firma" accept="image/*" onChange={handleChange} />
      </label>
      <button type="submit">Siguiente</button>
    </form>
  );
}

export default DatosPersonalesForm;
