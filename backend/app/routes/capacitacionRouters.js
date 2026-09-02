const { Router } = require('express');
const router = Router();

const capacitacionController = require('../controllers/capacitacionController');

router.get('/obtener', capacitacionController.obtener);
router.post('/crear', capacitacionController.post);
router.delete('/:id', capacitacionController.eliminar);
router.put('/:id', capacitacionController.actualizar);

module.exports = router;
