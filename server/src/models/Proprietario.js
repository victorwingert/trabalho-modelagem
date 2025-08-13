const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proprietario = sequelize.define('Proprietario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'ID'
    },
    nome: {
        type: DataTypes.STRING,
        field: 'Nome'
    },
    cpf: {
        type: DataTypes.STRING,
        field: 'CPF'
    },
    telefone: {
        type: DataTypes.STRING,
        field: 'Telefone'
    },
    quantidadeApartamentos: {
        type: DataTypes.INTEGER,
        field: 'Quantidade_Apartamentos'
    }
    // O campo id_entidade foi removido daqui para corresponder à view
}, {
    tableName: 'vw_proprietarios_del', // O nome da sua view
    timestamps: false,
    freezeTableName: true
});

module.exports = Proprietario;