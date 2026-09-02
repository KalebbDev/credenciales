const { obtenerDatosUsuario } = require('./jwtConfig');
const { createLogger, transports, format } = require('winston');

const options = {
  file: {
    filename: `/usr/src/app/logs/users.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = new createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.File(options.file), new transports.Console()],
});

function logInfo(req, action) {
  const logData = {
    timestamp: new Date().toISOString(),
    level: 'info',
    url: req.originalUrl,
    ip: req.ip,
    user_agent: req.headers['user-agent'] || '',
    action: action,
  };
  if (req.session.oficialiapt?.token) {
    const usuario = obtenerDatosUsuario(req.session.oficialiapt.token);
    logData.usuario = usuario.id;
    logData.nombre = usuario.nombre_completo;
  }
  logger.log(logData);
}

function logError(req, action, error, extra = {}) {
  const logData = {
    timestamp: new Date().toISOString(),
    level: 'error',
    url: req.originalUrl,
    ip: req.ip,
    user_agent: req.headers['user-agent'] || '',
    action,
    message: error?.message.replace(/\n/g, ' '),
    stack: error?.stack,
    ...extra,
  };
  if (req.session.oficialiapt?.token) {
    const usuario = obtenerDatosUsuario(req.session.oficialiapt.token);
    logData.usuario = usuario.id;
    logData.nombre = usuario.nombre_completo;
  }
  logger.log(logData);
}

module.exports = { logInfo, logError };
