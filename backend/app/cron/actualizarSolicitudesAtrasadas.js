const SolicitudesAtencionCiudadananosModel = require('../models/SolicitudesAtencionCiudadanaModel');

const actualizarSolicitudesAtrasadas = async () => {
  console.log('Ejecutando CRON: actualizarSolicitudesAtrasadas');
  const solicitudes = await SolicitudesAtencionCiudadananosModel.find({
    fecha_limite_atencion: { $lt: new Date() },
    estatus: 'creada',
  });
  for (const solicitud of solicitudes) {
    await SolicitudesAtencionCiudadananosModel.findByIdAndUpdate(solicitud._id, {
      $set: {
        estatus: 'atrasada',
      },
    });
  }
};

module.exports = actualizarSolicitudesAtrasadas;
