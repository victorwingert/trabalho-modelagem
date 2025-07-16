const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa a conexão com o banco

// Define o modelo 'Registro' que mapeia para a tabela 'Registros'
const Registro = sequelize.define('Registros', {
  // A coluna ID é a chave primária, com auto-incremento
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // A coluna Usuario armazenará o email ou nome de usuário
  Usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Garante que cada usuário seja único
  },
  // A coluna Senha armazenará o hash da senha
  Senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // A coluna Nivel_Acesso define o tipo de usuário
  Nivel_Acesso: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '0', // Define um valor padrão para novos registros
  },
}, {
  tableName: 'Registros', // Nome exato da tabela no banco
  timestamps: false,      // Desativa as colunas createdAt e updatedAt
});

module.exports = Registro;
