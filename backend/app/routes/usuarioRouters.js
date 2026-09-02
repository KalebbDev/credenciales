const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const usuarioController = require('../controllers/usuarioController');

// 🔐 LOGIN (todos pueden)
router.post('/login', usuarioController.loginUsuario);

// CRUD protegido
// Solo ADMIN puede crear usuarios
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), usuarioController.crearUsuario);

// Solo ADMIN puede ver lista de usuarios
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), usuarioController.obtenerUsuarios);

// Solo ADMIN puede actualizar usuarios
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), usuarioController.actualizarUsuario);

// Solo ADMIN puede eliminar usuarios
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), usuarioController.eliminarUsuario);

module.exports = router;
