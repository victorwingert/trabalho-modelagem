const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Este model representa a TABELA FÍSICA 'Moradores'.
// Ele será usado para CRIAR, ATUALIZAR e EXCLUIR.
const MoradorTabela = sequelize.define('MoradorTabela', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'ID'
    },
    // A tabela 'Moradores' é uma tabela de ligação.
    // Ela conecta uma Entidade a um Apartamento.
    ID_Entidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ID_Entidade', // Garanta que o nome da coluna no BD está correto
        references: {
            model: 'Entidades', // Nome da tabela de entidades no BD
            key: 'ID'
        }
    },
    ID_Apartamento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ID_Apartamento', // Garanta que o nome da coluna no BD está correto
        references: {
            model: 'Apartamentos', // Nome da tabela de apartamentos no BD
            key: 'ID'
        }
    }
}, {
    tableName: 'Moradores', // O nome exato da sua tabela física
    timestamps: false,
    freezeTableName: true,
    modelName: 'MoradorTabela'
});

module.exports = MoradorTabela;