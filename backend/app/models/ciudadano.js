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
      tipo: String,
      matricula: String,
      nombreTipo: String,
      folio: String
    }
  ],
  registradoPor: {
    nombre: String,
    rol: { type: String, enum: ["SUPER ADMIN","ADMIN", "ENCARGADO"] }
  }
});

module.exports = mongoose.model("Ciudadano", CiudadanoSchema);
