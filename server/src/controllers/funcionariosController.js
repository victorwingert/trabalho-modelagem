const Funcionario = require('../models/Funcionario'); // Model da view (para leitura)
const FuncionarioTabela = require('../models/FuncionarioTabela'); // Model da tabela (para escrita)
const Entidade = require('../models/Entidade');
const sequelize = require('../config/database');
const { Op } = require('sequelize');


// GET / - Listar todos os funcionários com filtros e paginação
const listarFuncionarios = async (req, res) => {
    try {
        const {
            pagina = 1,
            itensPorPagina = 8,
            termoPesquisa = '',
            campoOrdenacao = 'nome',
            direcaoOrdenacao = 'asc',
            filtroFuncao = '', // Compatibilidade com o frontend
            filtroTipo = '',
            filtroStatus = ''
        } = req.query;

        const where = {};
        if (termoPesquisa) {
            where[Op.or] = [
                { nome: { [Op.like]: `%${termoPesquisa}%` } },
                { cpf: { [Op.like]: `%${termoPesquisa}%` } },
                { telefone: { [Op.like]: `%${termoPesquisa}%` } },
                { tipoFuncionario: { [Op.like]: `%${termoPesquisa}%` } }
            ];
        }

        // Aceitar tanto filtroFuncao (frontend) quanto filtroTipo
        if (filtroFuncao || filtroTipo) {
            where.tipoFuncionario = filtroFuncao || filtroTipo;
        }
        if (filtroStatus) where.status = filtroStatus;

        const offset = (parseInt(pagina) - 1) * parseInt(itensPorPagina);

        const { count, rows } = await Funcionario.findAndCountAll({
            where: where,
            limit: parseInt(itensPorPagina),
            offset: offset,
            order: [[campoOrdenacao, direcaoOrdenacao.toUpperCase()]]
        });

        // Mapear os resultados para incluir 'funcao' para compatibilidade
        const dadosCompatibilidade = rows.map(funcionario => ({
            ...funcionario.toJSON(),
            funcao: funcionario.tipoFuncionario // Adicionar campo 'funcao'
        }));

        res.json({
            dados: dadosCompatibilidade,
            totalItens: count,
            totalPaginas: Math.ceil(count / parseInt(itensPorPagina)),
            paginaAtual: parseInt(pagina),
            itensPorPagina: parseInt(itensPorPagina)
        });
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// GET /:id - Buscar um funcionário específico
const buscarFuncionarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const funcionario = await Funcionario.findByPk(id);

        if (!funcionario) {
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }

        // Adicionar campo 'funcao' para compatibilidade
        const funcionarioCompatibilidade = {
            ...funcionario.toJSON(),
            funcao: funcionario.tipoFuncionario
        };

        res.json(funcionarioCompatibilidade);
    } catch (error) {
        console.error('Erro ao buscar funcionário:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// POST / - Criar novo funcionário
const criarFuncionario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { nome, cpf, telefone, id_registro, tipoFuncionario, funcao, status } = req.body;
        
        const tipoFunc = tipoFuncionario || funcao;

        if (!nome || !cpf || !telefone || !tipoFunc) {
            await t.rollback();
            return res.status(400).json({ 
                erro: 'Campos obrigatórios: nome, cpf, telefone, tipoFuncionario (ou funcao).' 
            });
        }
        
        // CORREÇÃO FINAL: Criando a entidade exatamente como a tabela
        const entidade = await Entidade.create({
            nome, 
            cpf, 
            telefone,
            ID_Registro: id_registro // O model já mapeia para o nome da coluna correta
        }, { transaction: t });
        
        // O resto da sua lógica para verificar duplicidade e criar o funcionário...
        const novoFuncionario = await FuncionarioTabela.create({
            ID_Entidade: entidade.id,
            Tipo_Funcionario: tipoFunc,
            Status: status || 'Ativo'
        }, { transaction: t });
        
        await t.commit();
        
        const funcionarioCompleto = await Funcionario.findByPk(novoFuncionario.id);
        
        res.status(201).json({
            ...funcionarioCompleto.toJSON(),
            funcao: funcionarioCompleto.tipoFuncionario
        });

    } catch (error) {
        await t.rollback();
        console.error('Erro ao criar funcionário:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// PUT /:id - Atualizar funcionário
const atualizarFuncionario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { nome, cpf, telefone, id_registro, tipoFuncionario, funcao, status } = req.body;
        
        const tipoFunc = tipoFuncionario || funcao;

        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            await t.rollback();
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }

        // CORREÇÃO FINAL: Atualizando a entidade exatamente como a tabela
        await Entidade.update({
            nome, 
            cpf, 
            telefone,
            ID_Registro: id_registro
        }, {
            where: { id: funcionario.id_entidade },
            transaction: t
        });

        // O resto da sua lógica para atualizar o funcionário...
        await FuncionarioTabela.update({ 
            Tipo_Funcionario: tipoFunc,
            Status: status || 'Ativo'
        }, { 
            where: { id: id }, 
            transaction: t 
        });

        await t.commit();

        const funcionarioAtualizado = await Funcionario.findByPk(id);
        
        res.json({
            ...funcionarioAtualizado.toJSON(),
            funcao: funcionarioAtualizado.tipoFuncionario
        });

    } catch (error) {
        await t.rollback();
        console.error('Erro ao atualizar funcionário:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// DELETE /:id - Excluir funcionário
const excluirFuncionario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        
        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }

        const id_entidade = funcionario.id_entidade;

        // Exclui o funcionário
        await FuncionarioTabela.destroy({ where: { id: id }, transaction: t });

        // Verifica se a entidade ainda é usada por outros funcionários ou moradores
        const outrosFuncionarios = await FuncionarioTabela.count({
            where: { ID_Entidade: id_entidade },
            transaction: t
        });

        // Aqui você pode adicionar verificação para moradores também, se necessário
        // const outrosMoradores = await Morador.count({ ... });

        // Se a entidade não é mais usada, pode excluir
        if (outrosFuncionarios === 0) {
            await Entidade.destroy({ where: { id: id_entidade }, transaction: t });
        }
        
        await t.commit();
        res.json({ sucesso: true, mensagem: 'Funcionário excluído com sucesso' });

    } catch (error) {
        await t.rollback();
        console.error('Erro ao excluir funcionário:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

module.exports = {
    listarFuncionarios,
    buscarFuncionarioPorId,
    criarFuncionario,
    atualizarFuncionario,
    excluirFuncionario
};