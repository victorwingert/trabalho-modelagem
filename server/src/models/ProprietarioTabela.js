const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Model para a tabela 'proprietarios' (não a view)
// Use este model nas operações de CREATE, UPDATE, DELETE
const ProprietarioTabela = sequelize.define('ProprietarioTabela', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'ID'
    },
    ID_Entidade: {
        type: DataTypes.INTEGER,
        field: 'ID_Entidade',
        allowNull: false
    }
}, {
    tableName: 'proprietarios', // Nome da tabela real
    timestamps: false,
    freezeTableName: true
});

module.exports = ProprietarioTabela;