const logger = require('./logger');

function errorHandler(err, req, res) {
  logger.error({
    timestamp: new Date().toISOString(),
    level: 'error',
    method: req.method,
    url: req.originalUrl,
    status: 500,
    ip: req.ip,
    user_agent: req.headers['user-agent'] || '',
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;
