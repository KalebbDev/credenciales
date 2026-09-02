const { validationResult } = require('express-validator');
const { respuestaHTTP } = require('./respuestaHttp');

const validadorResultados = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (e) {
    respuestaHTTP(res, 400, 'Error de validacion', e.errors);
  }
};

module.exports = { validadorResultados };
