// src/routes/condominioRoutes.js

const express = require('express');
const router = express.Router();
const condominioController = require('../controllers/condominioController');

// Rota GET para /api/condominio/blocos
router.get('/blocos', condominioController.listarBlocos);

// Rota GET para /api/condominio/apartamentos
router.get('/apartamentos', condominioController.listarApartamentos);

module.exports = router;