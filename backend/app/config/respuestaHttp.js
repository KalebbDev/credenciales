// config/respuestaHttp.js
const respuestaHTTP = (res, codigo, mensaje, data = null) => {
  console.log("🔍 Data recibida en respuestaHTTP:", data);
  res.status(codigo).json({
    success: codigo >= 200 && codigo < 300,
    code: codigo,
    message: mensaje,
    data
  });
};

module.exports = { respuestaHTTP };
