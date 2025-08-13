const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Model para a tabela 'funcionarios' (não a view)
// Use este model nas operações de CREATE, UPDATE, DELETE
const FuncionarioTabela = sequelize.define('FuncionarioTabela', {
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
    },
    Tipo_Funcionario: {
        type: DataTypes.STRING,
        field: 'Tipo_Funcionario',
        allowNull: false
    },
    Status: {
        type: DataTypes.STRING,
        field: 'Status',
        defaultValue: 'Ativo'
    }
}, {
    tableName: 'funcionarios', // Nome da tabela real
    timestamps: false,
    freezeTableName: true
});

module.exports = FuncionarioTabela;