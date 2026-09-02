const Usuario = require('../models/usuario');
const bcrypt = require("bcryptjs");
const HttpError = require('../config/httpError');
const utils = require('../utils/hash');
const jwt = require('jsonwebtoken');

//login
exports.loginUsuario = async (correo, contrasena) => {
  // Buscar usuario por correo
  const usuario = await Usuario.findOne({ correo });

  if (!usuario) {
    throw new HttpError('Usuario o contraseña incorrectos', 404);
  }

  // Validar contraseña
  const esValido = await utils.compararHash(contrasena, usuario.contrasena);
  if (!esValido) {
    throw new HttpError('Usuario o contraseña incorrectos', 404);
  }

  // Validar estatus
  if (usuario.clave_estatus !== 1) {
    throw new HttpError('El usuario está deshabilitado, por favor, comunícate con el administrador', 403);
  }

  const token = jwt.sign(
    { id: usuario._id, correo: usuario.correo, rol: usuario.rol },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '1h' }
    );

    return {
        token,
        usuario: {
            id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
        },
    };
};

// READ
exports.obtenerUsuarios = async () => {
  // Ocultamos contraseña y __v
  return await Usuario.find({}, { contrasena: 0, __v: 0 });
};

exports.crearUsuario = async ({ nombre, correo, edad, contrasena, rol, clave_estatus }) => {
  if (!contrasena) throw new HttpError("La contraseña es obligatoria", 400);

  const salt = await bcrypt.genSalt(10);
  const hashedContrasena = await bcrypt.hash(contrasena, salt);

  const nuevo = new Usuario({
    nombre,
    correo,
    edad,
    contrasena: hashedContrasena,
    rol,                        // ADMIN o ENCARGADO
    clave_estatus: clave_estatus ?? 1 // por defecto habilitado
  });

  return await nuevo.save();
};



exports.actualizarUsuario = async (id, { nombre, correo, edad, contrasena, rol, clave_estatus }) => {
  let updateData = { nombre, correo, edad, rol, clave_estatus };

  if (contrasena) {
    const salt = await bcrypt.genSalt(10);
    updateData.contrasena = await bcrypt.hash(contrasena, salt);
  }

  return await Usuario.findByIdAndUpdate(
    id,
    updateData,
    { new: true, projection: { contrasena: 0, __v: 0 } }
  );
};


exports.eliminarUsuario = async (id) => {
  return await Usuario.findByIdAndDelete(id);
};
