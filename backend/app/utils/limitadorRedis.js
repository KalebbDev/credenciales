const { RateLimiterRedis } = require('rate-limiter-flexible');
const { redisClient } = require('../config/redis'); // importa tu redisClient
const { respuestaHTTP } = require('../config/respuestaHttp');

// Configura el limitador
const limitadorPeticiones = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit:', // prefijo de claves Redis
  points: 10,
  duration: 60,
  blockDuration: 120, // bloqueo de 60s si se excede el límite
});

function middlewarePeticiones(req, res, next) {
  const key = req.ip;

  limitadorPeticiones
    .consume(key)
    .then((rateLimiterRes) => {
      // Si quedan pocos intentos, puedes incluir un header o loguearlo
      if (rateLimiterRes.remainingPoints == 2) {
        res.set('X-RateLimit-Warning', `Quedan ${rateLimiterRes.remainingPoints} intentos`);
      }

      next(); // Petición permitida, continúa el flujo
    })
    .catch((rateLimiterRes) => {
      const tiempoRestante = Math.ceil(rateLimiterRes.msBeforeNext / 1000); // segundos
      // Si se excede el límite, bloquear la petición
      return respuestaHTTP(res, 429, `Demasiados intentos. Intenta en ${tiempoRestante}s`);
    });
}

module.exports = middlewarePeticiones;
