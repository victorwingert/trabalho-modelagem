const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Certifique-se que o caminho está correto

const Bloco = sequelize.define('Bloco', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'ID' // Nome exato da coluna no seu banco
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'Nome_Bloco' // Nome exato da coluna no seu banco
    }
}, {
    tableName: 'Blocos', // Nome exato da tabela
    timestamps: false // Se sua tabela não tiver as colunas createdAt e updatedAt
});

module.exports = Bloco;