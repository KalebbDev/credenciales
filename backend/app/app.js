const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const { redisClient } = require('./config/redis');
const { RedisStore } = require('connect-redis');

const usuarioRoutes = require('./routes/usuarioRouters');   // login del sistema
const ciudadanoRoutes = require("./routes/ciudadanoRouters"); // solicitantes
const licenciaRoutes = require("./routes/licenciaRouters");   // licencias

const logMiddleware = require('./middlewares/logMiddleware');
const errorHandler = require('./config/errorHandler');
const dominiosPermitidos = require('./config/domains');
const conectarMongoDB = require('./config/mongodb');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

console.log('MONGO_URL:', process.env.MONGO_URL);

const app = express();   // ⚡️ primero declaramos app

// Conexión a MongoDB
conectarMongoDB()
  .then(() => console.log('MongoDB conectada exitosamente ✅'))
  .catch(console.error);

// Conexión a Redis
redisClient.connect().catch(console.error);

let store_redis = new RedisStore({
  client: redisClient,
  prefix: 'session-cookie:',
  ttl: 4 * (60 * 60000), // 4 horas
});

// Configuración de sesión
const sess = {
  store: store_redis,
  name: 'session.oficialiapt',
  secret: process.env.SECRET_COOKIE || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 4 * (60 * 60000),
  },
};

if (app.get('env') === 'dev') {
  sess.cookie.secure = false;
  sess.cookie.sameSite = 'Lax';
}
if (app.get('env') === 'test' || app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
  sess.cookie.sameSite = 'none';
}

// Middlewares
const dominios = dominiosPermitidos(app);
const corsOptions = (req, callback) => {
  const origin = req.header('Origin');
  if (dominios.includes(origin)) {
    callback(null, { origin: true, credentials: true });
  } else {
    callback(null, { origin: false });
  }
};

app.disable('x-powered-by');
app.use(session(sess));
app.use(cors(corsOptions));
app.use(express.json());
app.use(logMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'stg') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Archivos estáticos (para servir fotos y firmas)
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// Ruta base
app.get('/', (req, res) => {
  res.status(200).json({ status: 200, message: 'Hello world!' });
});

// Prefijo de API
const prefixInterna = `/api/v1/`;
app.use(`${prefixInterna}usuarios`, usuarioRoutes);
app.use(`${prefixInterna}ciudadanos`, ciudadanoRoutes);
app.use(`${prefixInterna}licencias`, licenciaRoutes);

// Manejo de errores
app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Not Found: ' + req.path });
});
app.use(errorHandler);

// 🚨 IMPORTANTE: NO usar app.listen aquí
module.exports = app;
