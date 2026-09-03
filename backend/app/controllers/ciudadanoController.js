const ciudadanoService = require("../services/ciudadanoService");

exports.crearCiudadano = async (req, res) => {
  try {
    const ciudadano = await ciudadanoService.crear(req.body);
    res.json({ message: "Ciudadano registrado correctamente", ciudadano });
  } catch (err) {
    res.status(500).json({ message: "Error al registrar ciudadano", error: err.message });
  }
};

exports.buscarPorCurp = async (req, res) => {
  try {
    const ciudadano = await ciudadanoService.buscarPorCurp(req.params.curp);
    if (!ciudadano) return res.status(404).json({ message: "Ciudadano no encontrado" });
    res.json(ciudadano);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar ciudadano", error: err.message });
  }
};


exports.listarCiudadanos = async (req, res) => {
  try {
    const ciudadanos = await ciudadanoService.listarTodos();
    res.json(ciudadanos);
  } catch (err) {
    res.status(500).json({ message: "Error al listar ciudadanos", error: err.message });
  }
};

exports.editarCiudadano = async (req, res) => {
  try {
    const ciudadano = await ciudadanoService.editar(req.params.id, req.body);
    if (!ciudadano) return res.status(404).json({ message: "Ciudadano no encontrado" });
    res.json({ message: "Ciudadano actualizado correctamente", ciudadano });
  } catch (err) {
    res.status(500).json({ message: "Error al editar ciudadano", error: err.message });
  }
};

exports.eliminarCiudadano = async (req, res) => {
  try {
    const eliminado = await ciudadanoService.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ message: "Ciudadano no encontrado" });
    res.json({ message: "Ciudadano eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar ciudadano", error: err.message });
  }
};
