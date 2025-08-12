const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajuste o caminho conforme sua estrutura

// Define o modelo 'Servico' que mapeia para a tabela 'SERVICOS'
const Servico = sequelize.define('SERVICOS', {
  // A coluna servico_id é a chave primária, com auto-incremento
  servico_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // A coluna tipo_servico armazenará o tipo do serviço
  tipo_servico: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  // A coluna descricrao armazenará a descrição do serviço (nome original da coluna)
  descricrao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // A coluna data_solicitacao armazenará a data de solicitação
  data_solicitacao: {
    type: DataTypes.DATEONLY, // Apenas data, sem hora
    allowNull: false,
  },
  // A coluna data_execucao armazenará a data de execução/conclusão
  data_execucao: {
    type: DataTypes.DATEONLY, // Apenas data, sem hora
    allowNull: true,
  },
  // A coluna status armazenará o status do serviço
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Pendente',
  },
  // A coluna morador_id referencia o morador que solicitou
  morador_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // A coluna funcionario_id referencia o funcionário responsável
  funcionario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'SERVICOS', // Nome exato da tabela no banco
  timestamps: false,      // Desativa as colunas createdAt e updatedAt
});

module.exports = Servico;