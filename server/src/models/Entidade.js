const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entidade = sequelize.define('Entidade', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'entidades',
  timestamps: false,
});

module.exports = Entidade;
