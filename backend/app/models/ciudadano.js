const mongoose = require("mongoose");

const CiudadanoSchema = new mongoose.Schema({
  datosPersonales: {
    nombre: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    curp: String,
    nacionalidad: String,
    tipoSanguineo: { type: String, enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
    donador: Boolean,
    alergias: String,
    nacimiento: Date,
    telefono: String,
    fotografia: String,
    firma: String
  },
  licencias: [
    {
      antiguedad: Date,
      expedida: Date,
      vencimiento: Date,
      vigencia: String,
      tipo: String,        // Ej: "A", "B", "C"
      matricula: String,
      nombreTipo: String,  // Ej: "Motociclista", "Automovilista"
      folio: String
    }
  ]
});

module.exports = mongoose.model("Ciudadano", CiudadanoSchema);
