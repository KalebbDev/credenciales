const jwt = require('jsonwebtoken');
const { respuestaHTTP } = require('./respuestaHttp');

/**
 * @param { res } -> Respuesta de la ruta
 * @param { usuario } -> Recibe los datos del usuario
 */
const crearTokenCookie = (req, res, usuario) => {
  const token = jwt.sign(
    {
      id: usuario._id,
      nombre_completo: usuario.nombre,
      correo: usuario.correo,
      clave_rol: usuario.clave_rol,
      clave_dependencia: usuario.clave_dependencia,
    },
    process.env.JWT_KEY,
    {
      expiresIn: '4h',
      issuer: process.env.EMISOR_JWT,
    }
  );

  req.session.token = token;

  return res;
};

const obtenerDatosUsuario = (token) => {
  return jwt.verify(token, process.env.JWT_KEY, {
    expiresIn: '4h',
    issuer: process.env.EMISOR_JWT,
  });
};

/**
 *
 * @param { token } -> Recibira el token
 * @returns
 */

const verificarToken = async (res, token) => {
  try {
    return jwt.verify(token, process.env.JWT_KEY, {
      expiresIn: '4h',
      issuer: process.env.EMISOR_JWT,
    });
  } catch (e) {
    respuestaHTTP(res, 401, `Error en verificar el token ${e}`);
  }
};

module.exports = { verificarToken, crearTokenCookie, obtenerDatosUsuario };
