const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticiasController');

// Mapeia cada rota para uma função do controller
router.get('/', noticiasController.listarNoticias);
router.get('/:id', noticiasController.buscarNoticiaPorId);
router.post('/', noticiasController.criarNoticia);
router.put('/:id', noticiasController.atualizarNoticia);
router.delete('/:id', noticiasController.excluirNoticia);

module.exports = router;