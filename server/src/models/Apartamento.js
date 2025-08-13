// src/models/Apartamento.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bloco = require('./Bloco'); // Importa o modelo de Bloco

const Apartamento = sequelize.define('Apartamento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'ID'
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'Numero'
    },
    andar: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Andar'
    },
    id_bloco: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ID_Bloco', // Chave estrangeira
        references: {
            model: Bloco,
            key: 'id'
        }
    }
}, {
    tableName: 'Apartamentos',
    timestamps: false
});

// Define a associação: Um Apartamento pertence a um Bloco
Apartamento.belongsTo(Bloco, { foreignKey: 'id_bloco', as: 'bloco' });

module.exports = Apartamento;