const express = require("express");
const router = express.Router();
const licenciaController = require("../controllers/licenciaController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Crear licencia
router.post("/:ciudadanoId", authMiddleware, roleMiddleware(["SUPER_ADMINISTRADOR","ADMIN", "ENCARGADO"]), licenciaController.crearLicencia);

// Listar licencias
router.get("/:ciudadanoId", authMiddleware, roleMiddleware(["SUPER_ADMINISTRADOR","ADMIN", "ENCARGADO"]), licenciaController.listarLicencias);

// Editar licencia de un ciudadano
router.put("/:ciudadanoId/:licenciaId", authMiddleware, roleMiddleware(["SUPER_ADMINISTRADOR","ADMIN", "ENCARGADO"]), licenciaController.editarLicencia);

// Eliminar licencia de un ciudadano
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["SUPER_ADMINISTRADOR"]),
  licenciaController.eliminarLicencia
);

// Listar todas las licencias de todos los ciudadanos
router.get("/", authMiddleware, roleMiddleware(["ADMIN", "ENCARGADO"]), licenciaController.listarTodasLicencias);

// Generar y mostrar PDF de una licencia
router.get("/:licenciaId/pdf", 
  authMiddleware, 
  roleMiddleware(["SUPER_ADMINISTRADOR","ADMIN", "ENCARGADO"]), 
  licenciaController.generarLicenciaPDF
);

module.exports = router;
