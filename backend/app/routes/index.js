const { Router } = require('express');


const usuariosRouter = require('./usuariosRouters');
const capacitacionRouters = require('./capacitacionRouters');

const router = Router();

router.use('/usuarios', usuariosRouter);
router.use('/capacitacion', capacitacionRouters);

module.exports = router;
