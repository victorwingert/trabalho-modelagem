const Proprietario = require('../models/Proprietario'); // Model da view (para leitura)
const ProprietarioTabela = require('../models/ProprietarioTabela'); // Model da tabela (para escrita)
const Entidade = require('../models/Entidade');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// GET / - Listar todos os proprietários com filtros e paginação
const listarProprietarios = async (req, res) => {
    try {
        const {
            pagina = 1,
            itensPorPagina = 8,
            termoPesquisa = '',
            campoOrdenacao = 'nome',
            direcaoOrdenacao = 'asc',
            filtroEntidade = ''
        } = req.query;

        const where = {};
        if (termoPesquisa) {
            where[Op.or] = [
                { nome: { [Op.like]: `%${termoPesquisa}%` } },
                { cpf: { [Op.like]: `%${termoPesquisa}%` } },
                { telefone: { [Op.like]: `%${termoPesquisa}%` } }
            ];
        }

        // Filtro por entidade (se necessário no futuro)
        if (filtroEntidade) where.id_entidade = parseInt(filtroEntidade);

        const offset = (parseInt(pagina) - 1) * parseInt(itensPorPagina);

        const { count, rows } = await Proprietario.findAndCountAll({
            where: where,
            limit: parseInt(itensPorPagina),
            offset: offset,
            order: [[campoOrdenacao, direcaoOrdenacao.toUpperCase()]]
        });

        // Adicionar campos compatíveis com o frontend
        const dadosCompatibilidade = rows.map(proprietario => ({
            ...proprietario.toJSON(),
            id_entidade: 1 // Campo esperado pelo frontend
        }));

        res.json({
            dados: dadosCompatibilidade,
            totalItens: count,
            totalPaginas: Math.ceil(count / parseInt(itensPorPagina)),
            paginaAtual: parseInt(pagina),
            itensPorPagina: parseInt(itensPorPagina)
        });
    } catch (error) {
        console.error('Erro ao buscar proprietários:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// GET /:id - Buscar um proprietário específico
const buscarProprietarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const proprietario = await Proprietario.findByPk(id);

        if (!proprietario) {
            return res.status(404).json({ erro: 'Proprietário não encontrado' });
        }

        // Adicionar campos para compatibilidade
        const proprietarioCompatibilidade = {
            ...proprietario.toJSON(),
            id_entidade: 1 // Campo esperado pelo frontend
        };

        res.json(proprietarioCompatibilidade);
    } catch (error) {
        console.error('Erro ao buscar proprietário:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// POST / - Criar novo proprietário
const criarProprietario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { nome, cpf, telefone, id_registro } = req.body;

        if (!nome || !cpf || !telefone) {
            return res.status(400).json({ erro: 'Campos obrigatórios: nome, cpf, telefone.' });
        }

        const whereCheck = [];
        if (cpf) whereCheck.push({ cpf: cpf });
        if (telefone) whereCheck.push({ telefone: telefone });
        if (id_registro) whereCheck.push({ id_registro: id_registro });

        if (whereCheck.length > 0) {
            const entidadeExistente = await Entidade.findOne({
                where: { [Op.or]: whereCheck },
                transaction: t
            });

            if (entidadeExistente) {
                await t.rollback();
                let campoDuplicado = 'desconhecido';
                if (entidadeExistente.cpf === cpf) campoDuplicado = 'CPF';
                else if (entidadeExistente.telefone === telefone) campoDuplicado = 'Telefone';
                else if (entidadeExistente.id_registro === id_registro) campoDuplicado = 'Registro';
                
                return res.status(409).json({ 
                    erro: `Erro de duplicidade: O ${campoDuplicado} informado já está em uso.` 
                });
            }
        }
        
        const entidade = await Entidade.create({
            nome,
            cpf,
            telefone,
            id_registro: id_registro
        }, { transaction: t });

        // Crie o proprietário com o nome de campo CORRETO
        const novoProprietario = await ProprietarioTabela.create({
            ID_Entidade: entidade.id // <-- CORREÇÃO APLICADA AQUI
        }, { transaction: t });
        
        await t.commit();
        
        const proprietarioCompleto = await Proprietario.findByPk(novoProprietario.id);
        
        res.status(201).json(proprietarioCompleto);

    } catch (error) {
        await t.rollback();
        console.error('Erro ao criar proprietário:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ erro: 'Erro de duplicidade. O CPF, telefone ou registro podem já estar em uso.' });
        }

        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// PUT /:id - Atualizar proprietário
const atualizarProprietario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { nome, cpf, telefone, id_registro } = req.body;

        const proprietario = await Proprietario.findByPk(id);
        if (!proprietario) {
            await t.rollback();
            return res.status(404).json({ erro: 'Proprietário não encontrado' });
        }

        // Atualiza a entidade associada com todos os campos
        await Entidade.update({
            nome, 
            cpf, 
            telefone,
            ID_Registro: id_registro // <-- CORREÇÃO APLICADA AQUI TAMBÉM
        }, {
            where: { id: proprietario.id_entidade },
            transaction: t
        });

        // Se houver campos na tabela 'proprietarios' para atualizar, faça aqui
        // await ProprietarioTabela.update({ ... });

        await t.commit();

        const proprietarioAtualizado = await Proprietario.findByPk(id);
        res.json(proprietarioAtualizado);

    } catch (error) {
        await t.rollback();
        console.error('Erro ao atualizar proprietário:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// DELETE /:id - Excluir proprietário
const excluirProprietario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        
        const proprietarioTabela = await ProprietarioTabela.findByPk(id);
        if (!proprietarioTabela) {
            return res.status(404).json({ erro: 'Proprietário não encontrado' });
        }

        const id_entidade = proprietarioTabela.ID_Entidade;

        // Exclui o proprietário
        await ProprietarioTabela.destroy({ where: { id: id }, transaction: t });

        // Verifica se a entidade ainda é usada por outros proprietários, funcionários ou moradores
        const outrosProprietarios = await ProprietarioTabela.count({
            where: { ID_Entidade: id_entidade },
            transaction: t
        });

        // Aqui você pode adicionar verificação para funcionários e moradores também, se necessário
        // const outrosFuncionarios = await FuncionarioTabela.count({ where: { ID_Entidade: id_entidade }, transaction: t });
        // const outrosMoradores = await MoradorTabela.count({ where: { id_entidade: id_entidade }, transaction: t });

        // Se a entidade não é mais usada, pode excluir
        if (outrosProprietarios === 0) {
            await Entidade.destroy({ where: { id: id_entidade }, transaction: t });
        }
        
        await t.commit();
        res.json({ sucesso: true, mensagem: 'Proprietário excluído com sucesso' });

    } catch (error) {
        await t.rollback();
        console.error('Erro ao excluir proprietário:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

module.exports = {
    listarProprietarios,
    buscarProprietarioPorId,
    criarProprietario,
    atualizarProprietario,
    excluirProprietario
};