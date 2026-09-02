const jwt = require("jsonwebtoken");
const { respuestaHTTP } = require("../config/respuestaHttp");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return respuestaHTTP(res, 401, "Token requerido");
  }

  const token = authHeader.split(" ")[1]; // formato: Bearer <token>
  if (!token) {
    return respuestaHTTP(res, 401, "Token inválido");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    req.usuario = decoded; // guardamos info del usuario en la request
    next();
  } catch (error) {
    return respuestaHTTP(res, 403, "Token no válido o expirado");
  }
};

module.exports = authMiddleware;
