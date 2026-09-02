const { Router } = require('express');
const UsuarioModel = require('../models/UsuarioModel');
const { middlewareToken, middlewareRoles } = require('../middlewares/middlewares');

const router = Router();
const { respuestaHTTP } = require('../config/respuestaHttp');
const { SUPERADMINISTRADOR, ADMINISTRADOR } = require('../config/roles');

const usuariosController = require('../controllers/usuariosController');

//Inicio de sesion
router.post('/login', usuariosController.login);

router.get('/logout', middlewareToken, usuariosController.logout);

router.get('/validar_sesion', middlewareToken, async (req, res) => {
  respuestaHTTP(res, 200, 'Correcto');
});

router.get('/validar_sesion_admin', middlewareToken, middlewareRoles([SUPERADMINISTRADOR, ADMINISTRADOR]), async (req, res) => {
  respuestaHTTP(res, 200, 'Correcto');
});

router.get('/obtener_informacion_usuario', middlewareToken, usuariosController.obtenerInformacionUsuario);

router.get(
  '/obtener_usuarios',
  middlewareToken,
  middlewareRoles([SUPERADMINISTRADOR, ADMINISTRADOR]),
  usuariosController.obtenerInformacionUsuarios
);

router.post(
  '/crear_usuario',
  middlewareToken,
  middlewareRoles([SUPERADMINISTRADOR, ADMINISTRADOR]),
  usuariosController.crearUsuario
);

router.put(
  '/actualizar_usuario',
  middlewareToken,
  middlewareRoles([SUPERADMINISTRADOR, ADMINISTRADOR]),
  usuariosController.actualizarUsuario
);

router.put(
  '/actualizar_estatus',
  middlewareToken,
  middlewareRoles([SUPERADMINISTRADOR, ADMINISTRADOR]),
  usuariosController.actualizarUsuarioEstatus
);

router.put(
  '/actualizar_contrasena',
  middlewareToken,
  middlewareRoles([SUPERADMINISTRADOR, ADMINISTRADOR]),
  usuariosController.actualizarContrasena
);

/* 
    Funciones de utilidad
*/

router.get('/verificar_correo/:correo', async (req, res) => {
  try {
    const correo = req.params.correo;

    if (!correo) {
      respuestaHTTP(res, 400, 'Error al obtener el correo');
    }

    const correoExiste = await UsuarioModel.findOne({ correo: correo });
    if (correoExiste) {
      return res.json({ bandera: true });
    } else {
      return res.json({ bandera: false });
    }
  } catch (e) {
    console.error('Error al verificar correo:', e);
    respuestaHTTP(res, 400, 'Error en verificar correo');
  }
});

router.get('/verificar_curp/:curp', async (req, res) => {
  try {
    const curp = req.params.curp;

    if (!curp) {
      respuestaHTTP(res, 404, 'No se encontro la CURP');
    }

    const curpExiste = await UsuarioModel.findOne({ curp: curp });

    if (curpExiste) {
      return res.json({ bandera: true });
    } else {
      return res.json({ bandera: false });
    }
  } catch (e) {
    console.error('Error al verificar CURP:', e);
    respuestaHTTP(res, 400, 'Error en verificar CURP');
  }
});

module.exports = router;
