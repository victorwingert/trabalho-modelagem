const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Apartamento = require('./Apartamento');
const Entidade = require('./Entidade');

const Morador = sequelize.define('Morador', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: DataTypes.STRING,
}, {
  tableName: 'moradores',
  timestamps: false,
});

Morador.belongsTo(Apartamento, { foreignKey: 'id_apartamento' });
Morador.belongsTo(Entidade, { foreignKey: 'id_entidade' });

module.exports = Morador;