const { respuestaHTTP } = require("../config/respuestaHttp");

const roleMiddleware = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return respuestaHTTP(res, 403, "No tienes permisos para acceder a esta ruta");
    }
    next();
  };
};

module.exports = roleMiddleware;
