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
    {
      id: usuario._id,
      nombre: usuario.nombre,   // 
      correo: usuario.correo,
      rol: usuario.rol          // ADMIN o ENCARGADO
    },
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

//READ seleccionado
exports.listarTodos = async (rolSolicitante) => {
  if (rolSolicitante === "SUPER_ADMINISTRADOR") {
    // El super admin ve todo
    return await Usuario.find({}, { contrasena: 0, __v: 0 });
  } else {
    // Admin y encargado no ven al super admin
    return await Usuario.find(
      { rol: { $ne: "SUPER_ADMINISTRADOR" } },
      { contrasena: 0, __v: 0 }
    );
  }
};


// READ
exports.obtenerUsuarios = async () => {
  // Ocultamos contraseña y __v
  return await Usuario.find({}, { contrasena: 0, __v: 0 });
};

exports.crearUsuario = async ({ nombre, correo, edad, contrasena, rol, clave_estatus }, rolSolicitante) => {
  if (!contrasena) throw new HttpError("La contraseña es obligatoria", 400);

  // Validar permisos según rol solicitante
  if (rolSolicitante === "ADMIN") {
    if (rol === "SUPER_ADMINISTRADOR") {
      throw new HttpError("Un ADMIN no puede crear un SUPER_ADMINISTRADOR", 403);
    }
  } else if (rolSolicitante !== "SUPER_ADMINISTRADOR") {
    throw new HttpError("No tienes permisos para crear usuarios", 403);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedContrasena = await bcrypt.hash(contrasena, salt);

  const nuevo = new Usuario({
    nombre,
    correo,
    edad,
    contrasena: hashedContrasena,
    rol,                        // validado arriba
    clave_estatus: clave_estatus ?? 1
  });

  return await nuevo.save();
};




exports.actualizarUsuario = async (id, datos, rolSolicitante) => {
  let updateData = {};

  // SUPER ADMINISTRADOR puede todo
  if (rolSolicitante === "SUPER_ADMINISTRADOR") {
    updateData = { 
      nombre: datos.nombre, 
      correo: datos.correo, 
      edad: datos.edad, 
      rol: datos.rol, 
      clave_estatus: datos.clave_estatus 
    };

    if (datos.contrasena) {
      const salt = await bcrypt.genSalt(10);
      updateData.contrasena = await bcrypt.hash(datos.contrasena, salt);
    }
  }

  // ADMIN tiene restricciones
  else if (rolSolicitante === "ADMIN") {
    updateData = { 
      nombre: datos.nombre, 
      correo: datos.correo, 
      edad: datos.edad, 
      clave_estatus: datos.clave_estatus 
    };

    // Solo puede asignar ADMIN o ENCARGADO
    if (datos.rol && datos.rol !== "SUPER_ADMINISTRADOR") {
      updateData.rol = datos.rol;
    }
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
