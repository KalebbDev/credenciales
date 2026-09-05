const usuarioService = require('../services/usuariosService');
const { respuestaHTTP } = require('../config/respuestaHttp');

// LOGIN
exports.loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const data = await usuarioService.loginUsuario(correo, contrasena);
    respuestaHTTP(res, 200, 'Acceso correcto.', data);
  } catch (error) {
    respuestaHTTP(res, error.code || 500, error.message);
  }
};

//READ selecionado
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.listarTodos(req.usuario.rol);
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: "Error al listar usuarios", error: err.message });
  }
};

// READ
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerUsuarios();
    respuestaHTTP(res, 200, 'Lista de usuarios.', usuarios);
  } catch (error) {
    respuestaHTTP(res, error.code || 500, error.message);
  }
};

// CREATE
exports.crearUsuario = async (req, res) => {
  try {
    const data = await usuarioService.crearUsuario(req.body, req.usuario.rol);
    respuestaHTTP(res, 201, 'Usuario creado.', data);
  } catch (error) {
    let statusCode = 500;
    let message = error.message;

    if (error.code === 11000) {
      statusCode = 400;
      message = "El correo ya está registrado, usa otro.";
    } else if (error.code && error.code >= 100 && error.code < 600) {
      statusCode = error.code;
    }

    respuestaHTTP(res, statusCode, message);
  }
};


// UPDATE
exports.actualizarUsuario = async (req, res) => {
  try {
    const data = await usuarioService.actualizarUsuario(
      req.params.id,
      req.body,
      req.usuario.rol // rol del que hace la petición
    );
    respuestaHTTP(res, 200, 'Usuario actualizado.', data);
  } catch (error) {
    let statusCode = 500;
    let message = error.message;

    if (error.code === 11000) {
      statusCode = 400;
      message = "El correo ya está registrado, usa otro.";
    } else if (error.code && error.code >= 100 && error.code < 600) {
      statusCode = error.code;
    }

    respuestaHTTP(res, statusCode, message);
  }
};


//DELETE
exports.eliminarUsuario = async (req, res) => {
  try {
    const data = await usuarioService.eliminarUsuario(req.params.id);
    if (!data) {
      return respuestaHTTP(res, 404, "Usuario no encontrado");
    }
    respuestaHTTP(res, 200, "Usuario eliminado", data);
  } catch (error) {
    let statusCode = 500;
    let message = error.message;

    if (error.code && error.code >= 100 && error.code < 600) {
      statusCode = error.code;
    }

    respuestaHTTP(res, statusCode, message);
  }
};

