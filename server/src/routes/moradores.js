const express = require('express');
const router = express.Router();
const moradorController = require('../controllers/moradoresController');

// Mapeia cada rota para uma função do controller
router.get('/', moradorController.listarMoradores);
router.get('/:id', moradorController.buscarMoradorPorId);
router.post('/', moradorController.criarMorador);
router.put('/:id', moradorController.atualizarMorador);
router.delete('/:id', moradorController.excluirMorador);

module.exports = router;