const mongoose = require('mongoose');

const DependenciasSchema = mongoose.Schema(
  {
    estatus: { type: String },
    clave_dependencia: { type: Number },
    nombre_dependencia: { type: String },
    acronimo: { type: String },
    tipo_dependencia: { type: String },
    subtipo_dependencia: { type: String },
    correo_titular_cero_papel: { type: String },
    nombre_titular: { type: String },
  },
  { timestamps: true }
);

const DependenciasModel = mongoose.model('dependencias', DependenciasSchema);
module.exports = DependenciasModel;
