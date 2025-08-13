const Morador = require('../models/Morador'); // Seu model de Morador (usando a VIEW)
const Entidade = require('../models/Entidade'); // O model de Entidade que criamos acima
const sequelize = require('../config/database'); // A instância do sequelize para transações
const { Op } = require('sequelize');

// GET / - Listar todos os moradores com filtros e paginação
const listarMoradores = async (req, res) => {
    try {
        const {
            pagina = 1,
            itensPorPagina = 8,
            termoPesquisa = '',
            campoOrdenacao = 'nome',
            direcaoOrdenacao = 'asc',
            filtroBloco = '',
            filtroEntidade = ''
        } = req.query;

        const where = {};
        if (termoPesquisa) {
            where[Op.or] = [
                { nome: { [Op.like]: `%${termoPesquisa}%` } },
                { cpf: { [Op.like]: `%${termoPesquisa}%` } },
                { telefone: { [Op.like]: `%${termoPesquisa}%` } },
                { numeroApartamento: { [Op.like]: `%${termoPesquisa}%` } },
                { nomeBloco: { [Op.like]: `%${termoPesquisa}%` } },
            ];
        }

        if (filtroBloco) where.id_bloco = parseInt(filtroBloco);
        if (filtroEntidade) where.id_entidade = parseInt(filtroEntidade);

        const offset = (parseInt(pagina) - 1) * parseInt(itensPorPagina);

        const { count, rows } = await Morador.findAndCountAll({
            where: where,
            limit: parseInt(itensPorPagina),
            offset: offset,
            order: [[campoOrdenacao, direcaoOrdenacao.toUpperCase()]]
        });

        res.json({
            dados: rows,
            totalItens: count,
            totalPaginas: Math.ceil(count / parseInt(itensPorPagina)),
            paginaAtual: parseInt(pagina),
            itensPorPagina: parseInt(itensPorPagina)
        });
    } catch (error) {
        console.error('Erro ao buscar moradores:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// GET /:id - Buscar um morador específico
const buscarMoradorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        // findByPk é o método ideal para buscar pela chave primária
        const morador = await Morador.findByPk(id);

        if (!morador) {
            return res.status(404).json({ erro: 'Morador não encontrado' });
        }
        res.json(morador);
    } catch (error) {
        console.error('Erro ao buscar morador:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// POST / - Criar novo morador
const criarMorador = async (req, res) => {
    // Usamos uma transação para garantir que ambas as operações (criar/atualizar entidade e criar morador)
    // funcionem ou falhem juntas.
    const t = await sequelize.transaction();
    try {
        const { nome, cpf, telefone, email, id_apartamento, id_entidade, tipo } = req.body;

        if (!nome || !cpf || !telefone || !id_apartamento) {
            return res.status(400).json({ erro: 'Campos obrigatórios: nome, cpf, telefone, id_apartamento' });
        }

        let entidade;
        if (id_entidade) {
            // Se um id_entidade foi passado, atualizamos a entidade existente
            [entidade] = await Entidade.upsert({
                id: id_entidade,
                nome, cpf, telefone, email, tipo: tipo || 'Proprietário'
            }, { transaction: t, returning: true });
        } else {
            // Se não, criamos uma nova entidade
            entidade = await Entidade.create({
                nome, cpf, telefone, email, tipo: tipo || 'Proprietário'
            }, { transaction: t });
        }

        // Criamos o morador referenciando a entidade
        // ATENÇÃO: Seu model Morador.js deve ter as associações corretas para isso funcionar
        // ou você precisa de um model para a tabela 'Moradores' real, não a view.
        // Assumindo um model para a tabela 'Moradores':
        const novoMorador = await Morador.create({
            id_apartamento: id_apartamento,
            id_entidade: entidade.id
        }, { transaction: t });
        
        // Se tudo deu certo, confirma a transação
        await t.commit();
        
        // Busca o morador completo na view para retornar ao front-end
        const moradorCompleto = await Morador.findByPk(novoMorador.id);
        res.status(201).json(moradorCompleto);

    } catch (error) {
        // Se algo deu errado, desfaz a transação
        await t.rollback();
        console.error('Erro ao criar morador:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// PUT /:id - Atualizar morador
const atualizarMorador = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { nome, cpf, telefone, email, id_apartamento, tipo } = req.body;

        // Primeiro, buscar o morador na VIEW para pegar o id_entidade
        const morador = await Morador.findByPk(id);
        if (!morador) {
            return res.status(404).json({ erro: 'Morador não encontrado' });
        }

        // Atualiza a entidade associada
        await Entidade.update({
            nome, cpf, telefone, email, tipo: tipo || 'Proprietário'
        }, {
            where: { id: morador.id_entidade },
            transaction: t
        });

        // Atualiza o apartamento do morador, se fornecido
        if (id_apartamento) {
            // Isso requer um model para a tabela 'Moradores'
            await Morador.update({ id_apartamento }, { where: { id: id }, transaction: t });
        }

        await t.commit();

        const moradorAtualizado = await Morador.findByPk(id);
        res.json(moradorAtualizado);

    } catch (error) {
        await t.rollback();
        console.error('Erro ao atualizar morador:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// DELETE /:id - Excluir morador
const excluirMorador = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        
        const morador = await Morador.findByPk(id);
        if (!morador) {
            return res.status(404).json({ erro: 'Morador não encontrado' });
        }

        const id_entidade = morador.id_entidade;

        // Exclui o morador (requer model da tabela 'Moradores')
        await Morador.destroy({ where: { id: id }, transaction: t });

        // Verifica se a entidade ainda é usada por outros moradores
        const outrosMoradores = await Morador.count({
            where: { id_entidade: id_entidade },
            transaction: t
        });

        // Se a entidade não é mais usada, pode excluir
        if (outrosMoradores === 0) {
            await Entidade.destroy({ where: { id: id_entidade }, transaction: t });
        }
        
        await t.commit();
        res.json({ sucesso: true, mensagem: 'Morador excluído com sucesso' });

    } catch (error) {
        await t.rollback();
        console.error('Erro ao excluir morador:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};


module.exports = {
    listarMoradores,
    buscarMoradorPorId,
    criarMorador,
    atualizarMorador,
    excluirMorador
};