const { respuestaHTTP } = require("../config/respuestaHttp");

const roleMiddleware = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return respuestaHTTP(res, 403, "Acceso denegado: no tienes permiso para realizar esta acción");
    }
    next();
  };
};

module.exports = roleMiddleware;
