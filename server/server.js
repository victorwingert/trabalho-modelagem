const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importa a conexão com o banco (para garantir que ela inicie)
require('./src/config/database');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- USAR AS ROTAS (FORMA CORRETA) ---
// Importa todos os seus arquivos de rotas
const authRoutes = require('./src/routes/authRoutes');
const produtosRoutes = require('./src/routes/produtos');
const pedidosRoutes = require('./src/routes/servicos');
const moradorRoutes = require('./src/routes/moradores');
const funcionarioRoutes = require('./src/routes/funcionarios');
const proprietarioRoutes = require('./src/routes/proprietarios');
const noticiasRoutes = require('./src/routes/noticias');
// NOVA LINHA


// Diz ao Express para usar um prefixo ÚNICO para cada conjunto de rotas.
// Esta é a correção mais importante.
app.use('/api/moradores', moradorRoutes);
app.use('/api/funcionarios', funcionarioRoutes); 
app.use('/api', authRoutes);
app.use('/api', produtosRoutes);
app.use('/api', pedidosRoutes); // Talvez renomear para /api/servicos?
app.use('/api/proprietarios', proprietarioRoutes);
app.use('/api/noticias', noticiasRoutes); 


// Inicia o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});