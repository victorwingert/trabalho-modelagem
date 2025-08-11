const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController');

// Define as rotas para produtos
// GET /api/produtos - Listar todos os produtos
router.get('/produtos', produtosController.listarProdutos);

// GET /api/produtos/:id - Buscar produto por ID
router.get('/produtos/:id', produtosController.buscarProdutoPorId);

// POST /api/produtos - Criar novo produto
router.post('/produtos', produtosController.criarProduto);

// PUT /api/produtos/:id - Atualizar produto
router.put('/produtos/:id', produtosController.atualizarProduto);

// DELETE /api/produtos/:id - Excluir produto
router.delete('/produtos/:id', produtosController.excluirProduto);

module.exports = router;