const { respuestaHTTP } = require('../config/respuestaHttp');
const capacitacionServices = require('../services/capacitacionServices');

//get
exports.obtener = async (req, res) => {
  try {
    const item = await capacitacionServices.obtenerItems();
    respuestaHTTP(res, 200, 'Se obtuvieron con exito', item);
  } catch (error) {
    console.log(error);
    respuestaHTTP(res, 500, 'Error al intentar obtener items', error);
  }
};
//post
exports.post = async (req, res) => {
    try {
      const nuevoItem = await capacitacionServices.post(req.body);
      respuestaHTTP(res, 201, 'Se creó la dependencia con éxito', nuevoItem);
    } catch (error) {
      console.error(error);
      respuestaHTTP(res, 500, 'Error al crear dependencia', error);
    }
}
//delete
exports.eliminar = async (req, res) => {
  try {
    const eliminado = await capacitacionServices.eliminarItem(req.params.id);
    if (!eliminado) {
      return respuestaHTTP(res, 404, 'No se encontró la dependencia');
    }
    respuestaHTTP(res, 200, 'Dependencia eliminada con éxito', eliminado);
  } catch (error) {
    console.error(error);
    respuestaHTTP(res, 500, 'Error al eliminar dependencia', error);
  }
};
//update
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await capacitacionServices.actualizarItem(id, req.body);
    if (!actualizado) {
      return respuestaHTTP(res, 404, 'No se encontró la dependencia');
    }
    respuestaHTTP(res, 200, 'Dependencia actualizada con éxito', actualizado);
  } catch (error) {
    console.error(error);
    respuestaHTTP(res, 500, 'Error al actualizar dependencia', error);
  }
};
 