const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionariosController');

// Mapeia cada rota para uma função do controller
router.get('/', funcionarioController.listarFuncionarios);
router.get('/:id', funcionarioController.buscarFuncionarioPorId);
router.post('/', funcionarioController.criarFuncionario);
router.put('/:id', funcionarioController.atualizarFuncionario);
router.delete('/:id', funcionarioController.excluirFuncionario);

module.exports = router;