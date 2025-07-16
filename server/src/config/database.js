// server/src/config/database.js

const { Sequelize } = require('sequelize');

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Cria uma nova instância do Sequelize com as credenciais do .env
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nome do banco
  process.env.DB_USER,      // Usuário
  process.env.DB_PASSWORD,  // Senha
  {
    host: process.env.DB_HOST, // Endereço do servidor
    dialect: 'mssql',          // Informa que estamos usando SQL Server

    // Opções específicas do dialeto para o Azure SQL
    dialectOptions: {
      options: {
        // A criptografia é OBRIGATÓRIA para conexões com o Azure SQL.
        // Se esta opção for 'false' ou não existir, a conexão falhará.
        encrypt: true,
      }
    },
    // Desligar o logging em produção é uma boa prática.
    // Durante o desenvolvimento, você pode deixar como console.log para ver as queries.
    logging: console.log, 
  }
);

// Função para testar a conexão ao iniciar a aplicação
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados do Azure estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  }
}

testConnection();

// Exporta a instância do sequelize para ser usada pelos Models
module.exports = sequelize;
