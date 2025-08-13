const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Morador = sequelize.define('Morador', {
    // Definição corrigida para corresponder à sua tabela
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'ID' // Nome exato da coluna no banco
    },
    nome: {
        type: DataTypes.STRING,
        field: 'NOME'
    },
    cpf: {
        type: DataTypes.STRING,
        field: 'CPF'
    },
    telefone: {
        type: DataTypes.STRING,
        field: 'TELEFONE'
    },
    id_entidade: {
        type: DataTypes.INTEGER,
        field: 'ID_ENTIDADE'
    },
    id_apartamento: { // Esta coluna faltava no seu SELECT anterior
        type: DataTypes.INTEGER,
        field: 'ID_APARTAMENTO'
    },
    numeroApartamento: {
        type: DataTypes.STRING,
        field: 'NUMERO_APARTAMENTO'
    },
    andar: {
        type: DataTypes.INTEGER,
        field: 'ANDAR'
    },
    id_bloco: {
        type: DataTypes.INTEGER,
        field: 'ID_BLOCO'
    },
    nomeBloco: {
        type: DataTypes.STRING,
        field: 'NOME_BLOCO'
    }
    // As colunas 'email' e 'nomeEntidade' foram removidas porque não existem na tabela
}, {
    tableName: 'vw_moradores_completo', // Verifique se o nome da sua VIEW é este mesmo
    timestamps: false,
    freezeTableName: true
});

module.exports = Morador;