const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Noticia = sequelize.define('Noticia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'titulo'
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'descricao'
    },
    data_publicacao: {
        type: DataTypes.DATEONLY, // Usamos DATEONLY para não considerar a parte de hora/fuso
        allowNull: false,
        field: 'data_publicacao'
    }
    // Os campos data_criacao e data_atualizacao são gerenciados pelo banco
}, {
    tableName: 'noticias',
    timestamps: true, // Habilita createdAt e updatedAt
    createdAt: 'data_criacao',
    updatedAt: false,
    freezeTableName: true
});

module.exports = Noticia;