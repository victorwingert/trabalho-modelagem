const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa a conexão com o banco

// Define o modelo 'Produto' que mapeia para a tabela 'Produtos'
const Produto = sequelize.define('Produtos', {
  // A coluna ID é a chave primária, com auto-incremento
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // A coluna Nome_Produto armazenará o nome do produto
  Nome_Produto: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'Nome_Produto', // Nome exato da coluna no banco
  },
  // A coluna Descricao armazenará a descrição do produto
  Descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // A coluna Categoria armazenará a categoria do produto
  Categoria: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  // A coluna Preco armazenará o preço do produto
  Preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  // A coluna Quantidade_Estoque armazenará a quantidade em estoque
  Quantidade_Estoque: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'Quantidade_Estoque', // Nome exato da coluna no banco
  },
  // A coluna Data_Cadastro armazenará a data de cadastro
  Data_Cadastro: {
    type: DataTypes.DATEONLY, // Apenas data, sem hora
    allowNull: true,
    field: 'Data_Cadastro', // Nome exato da coluna no banco
  },
  // A coluna Status armazenará o status do produto
  Status: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Ativo', // Define valor padrão como 'Ativo'
  },
  // A coluna Fornecedor armazenará o fornecedor do produto
  Fornecedor: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {  
  tableName: 'Produtos', // Nome exato da tabela no banco
  timestamps: false,      // Desativa as colunas createdAt e updatedAt
});

module.exports = Produto;