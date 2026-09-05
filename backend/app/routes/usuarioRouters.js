const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const usuarioController = require('../controllers/usuarioController');

// 🔐 LOGIN (todos pueden)
router.post('/login', usuarioController.loginUsuario);

// CRUD protegido
// SUPER_ADMINISTRADOR y ADMIN pueden crear usuarios
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["SUPER_ADMINISTRADOR", "ADMIN"]),
  usuarioController.crearUsuario
);

// Listar usuarios
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "SUPER_ADMINISTRADOR"]), // ambos pueden listar
  usuarioController.listarUsuarios
);

// SUPER ADMINISTRADOR y ADMIN pueden actualizar
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["SUPER_ADMINISTRADOR", "ADMIN"]),
  usuarioController.actualizarUsuario
);

// Solo SUPER_ADMIN puede eliminar usuarios
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["SUPER_ADMINISTRADOR"]),
  usuarioController.eliminarUsuario
);


module.exports = router;
