const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bloco = sequelize.define('Bloco', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: DataTypes.STRING,
}, {
  tableName: 'blocos',
  timestamps: false,
});

module.exports = Bloco;
