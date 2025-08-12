const express = require('express');
const router = express.Router();
const servicosController = require('../controllers/servicosController');

// Define as rotas para serviços
// GET /api/servicos - Listar todos os serviços
router.get('/servicos', servicosController.listarServicos);

// GET /api/servicos/:id - Buscar serviço por ID
router.get('/servicos/:id', servicosController.buscarServicoPorId);

// POST /api/servicos - Criar novo serviço
router.post('/servicos', servicosController.criarServico);

// PUT /api/servicos/:id - Atualizar serviço
router.put('/servicos/:id', servicosController.atualizarServico);

// DELETE /api/servicos/:id - Excluir serviço
router.delete('/servicos/:id', servicosController.excluirServico);

module.exports = router;