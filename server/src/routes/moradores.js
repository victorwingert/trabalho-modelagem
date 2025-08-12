const express = require('express');
const router = express.Router();
const moradorController = require('../controllers/moradoresController');

router.get('/moradores/', moradorController.getAll);
router.post('/moradores/', moradorController.create);
router.put('/moradores/:id', moradorController.update);
router.delete('/moradores/:id', moradorController.delete);

module.exports = router;