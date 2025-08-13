const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Funcionario = sequelize.define('Funcionario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'ID'
    },
    id_entidade: {
        type: DataTypes.INTEGER,
        field: 'ID_ENTIDADE'
    },
    tipoFuncionario: {
        type: DataTypes.STRING,
        field: 'Tipo_Funcionario'
    },
    // Alias para compatibilidade com o frontend
    funcao: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.getDataValue('tipoFuncionario');
        },
        set(value) {
            this.setDataValue('tipoFuncionario', value);
        }
    },
    status: {
        type: DataTypes.STRING,
        field: 'Status'
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
    }
}, {
    tableName: 'vw_funcionarios_model',
    timestamps: false,
    freezeTableName: true
});

module.exports = Funcionario;