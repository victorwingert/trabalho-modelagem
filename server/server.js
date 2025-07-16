const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importa a conexão com o banco (para garantir que ela inicie)
require('./src/config/database');

const app = express();

// Middlewares
app.use(cors()); // Permite que o front-end (em outra porta) acesse a API
app.use(express.json()); // Permite que o servidor entenda requisições com corpo em JSON

// --- USAR AS ROTAS ---
// Importa o arquivo de rotas de autenticação
const authRoutes = require('./src/routes/authRoutes');

// Diz ao Express para usar essas rotas quando a URL começar com /api
// Ex: /api/register, /api/login
app.use('/api', authRoutes);


// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});