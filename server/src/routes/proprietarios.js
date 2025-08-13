const express = require('express');
const router = express.Router();
const proprietarioController = require('../controllers/proprietariosController');

// Mapeia cada rota para uma função do controller
router.get('/', proprietarioController.listarProprietarios);
router.get('/:id', proprietarioController.buscarProprietarioPorId);
router.post('/', proprietarioController.criarProprietario);
router.put('/:id', proprietarioController.atualizarProprietario);
router.delete('/:id', proprietarioController.excluirProprietario);

module.exports = router;