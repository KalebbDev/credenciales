const mongoose = require('mongoose');

const RolSchema = mongoose.Schema(
  {
    clave_rol: { type: Number, enum: [] },
    nombre_rol: { type: String, enum: [] },
    permisos_rol: [{type: String}],
  },
  { timestamps: true }
);

const RolModel = mongoose.model('roles', RolSchema);
module.exports = RolModel;
