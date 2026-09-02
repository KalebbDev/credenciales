const logger = require('../config/logger');

function logMiddleware(req, res, next) {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startHrTime);
    const responseTime = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

    logger.info({
      timestamp: new Date().toISOString(),
      level: 'info',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      response_time: `${responseTime}ms`,
      ip: req.ip,
      user_agent: req.headers['user-agent'] || '',
      message: 'HTTP request',
    });
  });

  next();
}

module.exports = logMiddleware;
