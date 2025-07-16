const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define a rota POST para /register
// Quando uma requisição POST chegar em /api/register,
// a função authController.register será executada.
router.post('/register', authController.register);

// (No futuro, você adicionará a rota de login aqui)
// router.post('/login', authController.login);

module.exports = router;