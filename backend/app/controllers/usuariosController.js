const { respuestaHTTP } = require('../config/respuestaHttp');
const { crearTokenCookie } = require('../config/jwtConfig');
const { logInfo, logError } = require('../config/logUser');
const usuariosService = require('../services/usuariosService');

exports.login = async (req, res) => {
  try {
    const usuario = await usuariosService.loginUsuario(req.body.correo, req.body.contrasena);
    crearTokenCookie(req, res, usuario);
    logInfo(req, 'Acceso correcto.');
    respuestaHTTP(res, 200, 'Acceso correcto.');
  } catch (error) {
    logError(req, 'Error en inicio de sesión', error);
    respuestaHTTP(res, error.statusCode || 500, error.message);
  }
};

exports.logout = async (req, res) => {
  try {
    if (!req.sessionID) {
      return respuestaHTTP(res, 400, 'No existe una session activa');
    }
    await usuariosService.logout(req);

    res.clearCookie('session.oficialiapt', {
      path: '/',
      httpOnly: true,
      secure: req.app.get('env') !== 'dev',
    });

    return respuestaHTTP(res, 200, 'Sesión cerrada correctamente');
  } catch (error) {
    return respuestaHTTP(res, 400, `Error al cerrar la sesión ${error}`, error);
  }
};

exports.obtenerInformacionUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.obtenerInformacionUsuario(req.token);
    respuestaHTTP(res, 200, 'Información del usuario', usuario);
  } catch (error) {
    logError(req, 'Error al obtener información del usuario', error);
    respuestaHTTP(res, error.statusCode || 500, error.message);
  }
};

exports.obtenerInformacionUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosService.obtenerTodosUsuarios(req.token);
    respuestaHTTP(res, 200, 'Obtencion de usuarios correcto', usuarios);
  } catch (error) {
    logError(req, 'Error al obtener a los usuarios', error);
    respuestaHTTP(res, error.statusCode || 500, error.message);
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.crearUsuario(req.body);
    respuestaHTTP(res, 200, 'Usuario creado correctamente', usuario);
  } catch (error) {
    logError(req, 'Error al crear el usuario', error);
    respuestaHTTP(res, error.statusCode || 500, error.message);
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const usuario_actualizado = await usuariosService.actualizarUsuario(req.body);
    respuestaHTTP(res, 200, 'Usuario actualizado correctamente', usuario_actualizado);
  } catch (error) {
    logError(req, 'Error al actualizar el usuario', error);
    respuestaHTTP(res, error.statusCode || 500, error.message);
  }
};

exports.actualizarUsuarioEstatus = async (req, res) => {
  try {
    await usuariosService.actualizarUsuarioEstatus(req.body);
    respuestaHTTP(res, 200, 'Se actualizo el estatus correctamente');
  } catch (error) {
    logError(req, 'Error actualizar el estatus de el usuario', error);
    respuestaHTTP(res, error.statusCode || 500, error.message);
  }
};

exports.actualizarContrasena = async (req, res) => {
  try {
    await usuariosService.actualizarContrasena(req.body);
    respuestaHTTP(res, 200, 'Se actualizo correctamente la contrasena');
  } catch (error) {
    logError(req, 'Error al crear el usuario', error);
    respuestaHTTP(res, error.statusCode || 500, error.message);
  }
};
