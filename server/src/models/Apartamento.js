const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bloco = require('./Bloco');

const Apartamento = sequelize.define('Apartamento', {
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  andar: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'apartamentos',
  timestamps: false,
});

Apartamento.belongsTo(Bloco, { foreignKey: 'id_bloco' });
Bloco.hasMany(Apartamento, { foreignKey: 'id_bloco' });

module.exports = Apartamento;
