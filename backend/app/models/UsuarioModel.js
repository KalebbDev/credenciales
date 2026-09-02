const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema(
  {
    createdAt: { type: Date },
    updatedAt: { type: Date },
    token: { type: String },
    clave_estatus: { type: Number, default: 1 },
    nombre_estatus: { type: String, default: 'Habilitado' },
    justificacion_estatus: { type: String },
    correo: { type: String, required: true },
    contrasena: { type: String, required: true },
    nombre: { type: String, required: true },
    curp: { type: String, required: true },
    telefono_personal: { type: String, required: true },
    telefono_oficina: { type: String, required: true },
    clave_dependencia: { type: Number, required: true },
    clave_rol: {
      type: Number,
      required: true,
      enum: [217, 325, 448],
    },
  },
  {
    timestamps: true,
  }
);

const UsuarioModel = mongoose.model('usuarios', UsuariosSchema);
module.exports = UsuarioModel;
