const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  edad: { type: Number },
  contrasena: { type: String, required: true },
  clave_estatus: { type: Number, default: 1 }, // 1 = habilitado, 0 = deshabilitado
  rol: { type: String, enum: ['ADMIN', 'ENCARGADO'], required: true }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
