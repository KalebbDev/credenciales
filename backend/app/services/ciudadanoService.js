const Ciudadano = require("../models/ciudadano");


exports.buscarPorId = async (id) => {
  return await Ciudadano.findById(id);
};


exports.crear = async (datos) => {
  const ciudadano = new Ciudadano(datos);
  await ciudadano.save();
  return ciudadano;
};

exports.buscarPorCurp = async (curp) => {
  return await Ciudadano.findOne({ "datosPersonales.curp": curp });
};

exports.listarTodos = async () => {
  return await Ciudadano.find(); // devuelve todos los ciudadanos
};

exports.editar = async (id, datos) => {
  return await Ciudadano.findByIdAndUpdate(id, datos, { new: true });
};

exports.eliminar = async (id) => {
  return await Ciudadano.findByIdAndDelete(id);
};
