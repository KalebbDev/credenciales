//Dependencias de redis
const redis = require('redis');

let host = '';
if (process.env.NODE_ENV === 'production') {
  host = '10.50.230.81';
} else if (process.env.NODE_ENV === 'stg') {
  host = '10.50.230.95';
} else {
  host = 'redis';
}
const redisClient = redis.createClient({ socket: { host: host, port: 6379 } });

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}

redisClient.on('connect', () => {
  console.log('Redis esta intentando conectarse');
});

redisClient.on('ready', () => {
  console.log('Redis conectado exitosamente ✅');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = { connectRedis, redisClient };
