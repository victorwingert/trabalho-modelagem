const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Este é o seu model de LEITURA.
// Ele aponta para a VIEW e é usado para LISTAR e BUSCAR.
const Morador = sequelize.define('Morador', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'ID'
    },
    // Campos que vêm da VIEW (junção de Entidades, Apartamentos, etc.)
    nome: { type: DataTypes.STRING, field: 'Nome' },
    cpf: { type: DataTypes.STRING, field: 'CPF' },
    telefone: { type: DataTypes.STRING, field: 'Telefone' },
    id_entidade: { type: DataTypes.INTEGER, field: 'ID_Entidade' },
    id_apartamento: { type: DataTypes.INTEGER, field: 'ID_Apartamento' },
    numeroApartamento: { type: DataTypes.STRING, field: 'Numero_Apartamento' },
    andar: { type: DataTypes.INTEGER, field: 'Andar' },
    id_bloco: { type: DataTypes.INTEGER, field: 'ID_Bloco' },
    nomeBloco: { type: DataTypes.STRING, field: 'Nome_Bloco' }
    // Adicione outros campos da view se necessário...
}, {
    tableName: 'vw_moradores_completo', // O nome exato da sua VIEW no banco
    timestamps: false,
    freezeTableName: true
});

module.exports = Morador;