const express = require("express");
const router = express.Router();
const ciudadanoController = require("../controllers/ciudadanoController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");


const upload = require("../config/upload");

// Registrar ciudadano (solo ADMIN o ENCARGADO)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "ENCARGADO"]),
  upload.fields([
    { name: "fotografia", maxCount: 1 },
    { name: "firma", maxCount: 1 }
  ]),
  ciudadanoController.crearCiudadano
);


// Buscar ciudadano por ID
router.get("/:id", ciudadanoController.buscarPorId);

// Buscar ciudadano por CURP
router.get(
  "/:curp",
  authMiddleware,
  roleMiddleware(["ADMIN", "ENCARGADO"]),
  ciudadanoController.buscarPorCurp
);

// Listar todos los ciudadanos
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "ENCARGADO"]),
  ciudadanoController.listarCiudadanos
);

// Editar ciudadano
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "ENCARGADO"]),
  ciudadanoController.editarCiudadano
);

// Eliminar ciudadano
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "ENCARGADO"]),
  ciudadanoController.eliminarCiudadano
);

module.exports = router;
