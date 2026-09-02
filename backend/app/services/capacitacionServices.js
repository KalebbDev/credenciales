const DependenciasModel = require("../models/DependenciasModel");
//mostrar
exports.obtenerItems = async () => {
  const item = {
    nombre: 'Capacitacion',
    descripcion: 'Descripcion de la capacitacion',
    fecha: new Date(),
  };

  return item;
};
//agregar
exports.post = async (data) => {
  const nuevo = new DependenciasModel(data);
  const guardado = await nuevo.save();
  return guardado;

};
//eliminar
exports.eliminarItem = async (id) => {
  return await DependenciasModel.findByIdAndDelete(id);
};
//actualizar
exports.actualizarItem = async (id, data) => {
  return await DependenciasModel.findByIdAndUpdate(id, data, { new: true });
};


