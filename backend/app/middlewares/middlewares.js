const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/UsuarioModel');
const { respuestaHTTP } = require('../config/respuestaHttp');

const middlewareToken = async (req, res, next) => {
  try {
    const token = req.session.token;

    if (token == null) {
      respuestaHTTP(res, 401, 'No existe el token');
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY, {
      expiresIn: '4h',
      issuer: process.env.EMISOR_JWT,
    });

    req.token = decoded;

    next();
  } catch (e) {
    console.error('Error en middlewareToken:', e);
    respuestaHTTP(res, 401, `Acceso no autorizado`);
  }
};

const middlewareEstatusUsuario = async (req, res) => {
  try {
    const token = req.session.token;

    const usuario = await UsuarioModel.findOne({ _id: token.id }, { estatus: 'Habilitado' });
    if (usuario == null) {
      respuestaHTTP(res, 200, 'Usuario Inhabilitado');
    }
  } catch (e) {
    respuestaHTTP(res, 401, `No autorizado ${e}`);
  }
};

const middlewareRoles = (roles) => (req, res, next) => {
  const token = req.session.token;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const jwtRol = decoded.clave_rol;
    if (roles.includes(jwtRol)) {
      next();
    } else {
      respuestaHTTP(res, 401, 'Este rol no esta autorizado');
    }
  } else {
    respuestaHTTP(res, 500, 'No existe el token con el que se quiere ingresar');
  }
};

module.exports = { middlewareEstatusUsuario, middlewareRoles, middlewareToken };
