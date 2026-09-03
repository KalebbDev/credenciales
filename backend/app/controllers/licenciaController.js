const licenciaService = require("../services/licenciaService");

exports.crearLicencia = async (req, res) => {
  try {
    const licencia = await licenciaService.agregarLicencia(req.params.ciudadanoId, req.body);
    res.json({ message: "Licencia creada correctamente", licencia });
  } catch (err) {
    res.status(500).json({ message: "Error al crear licencia", error: err.message });
  }
};

exports.listarLicencias = async (req, res) => {
  try {
    const licencias = await licenciaService.obtenerLicencias(req.params.ciudadanoId);
    res.json(licencias);
  } catch (err) {
    res.status(500).json({ message: "Error al listar licencias", error: err.message });
  }
};

exports.editarLicencia = async (req, res) => {
  try {
    const licencia = await licenciaService.editarLicencia(req.params.ciudadanoId, req.params.licenciaId, req.body);
    if (!licencia) return res.status(404).json({ message: "Licencia no encontrada" });
    res.json({ message: "Licencia actualizada correctamente", licencia });
  } catch (err) {
    res.status(500).json({ message: "Error al editar licencia", error: err.message });
  }
};

exports.eliminarLicencia = async (req, res) => {
  try {
    const eliminado = await licenciaService.eliminarLicencia(req.params.ciudadanoId, req.params.licenciaId);
    if (!eliminado) return res.status(404).json({ message: "Licencia no encontrada" });
    res.json({ message: "Licencia eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar licencia", error: err.message });
  }
};

exports.listarTodasLicencias = async (req, res) => {
  try {
    const licencias = await licenciaService.obtenerTodasLicencias();
    res.json(licencias);
  } catch (err) {
    res.status(500).json({ message: "Error al listar todas las licencias", error: err.message });
  }
};
