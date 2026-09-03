const Ciudadano = require("../models/ciudadano");

exports.agregarLicencia = async (ciudadanoId, datosLicencia) => {
  const ciudadano = await Ciudadano.findById(ciudadanoId);
  if (!ciudadano) throw new Error("Ciudadano no encontrado");

  ciudadano.licencias.push(datosLicencia);
  await ciudadano.save();
  return ciudadano.licencias[ciudadano.licencias.length - 1];
};

exports.obtenerLicencias = async (ciudadanoId) => {
  const ciudadano = await Ciudadano.findById(ciudadanoId);
  if (!ciudadano) throw new Error("Ciudadano no encontrado");
  return ciudadano.licencias;
};

exports.editarLicencia = async (ciudadanoId, licenciaId, datos) => {
  const ciudadano = await Ciudadano.findById(ciudadanoId);
  if (!ciudadano) throw new Error("Ciudadano no encontrado");

  const licencia = ciudadano.licencias.id(licenciaId);
  if (!licencia) return null;

  Object.assign(licencia, datos);
  await ciudadano.save();
  return licencia;
};

exports.eliminarLicencia = async (ciudadanoId, licenciaId) => {
  const ciudadano = await Ciudadano.findById(ciudadanoId);
  if (!ciudadano) throw new Error("Ciudadano no encontrado");

  const licencia = ciudadano.licencias.id(licenciaId);
  if (!licencia) return null;

  licencia.remove();
  await ciudadano.save();
  return true;
};


exports.obtenerTodasLicencias = async () => {
  const ciudadanos = await Ciudadano.find({}, "licencias datosPersonales.nombre datosPersonales.apellidoPaterno datosPersonales.apellidoMaterno");
  
  // Flatten: devolver todas las licencias con info básica del ciudadano
  const todasLicencias = ciudadanos.flatMap(ciudadano =>
    ciudadano.licencias.map(licencia => ({
      ciudadanoId: ciudadano._id,
      nombre: `${ciudadano.datosPersonales.nombre} ${ciudadano.datosPersonales.apellidoPaterno} ${ciudadano.datosPersonales.apellidoMaterno}`,
      ...licencia.toObject()
    }))
  );

  return todasLicencias;
};
