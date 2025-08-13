const Noticia = require('../models/Noticia');
const { Op } = require('sequelize');

// GET / - Listar todas as notícias com filtros, paginação e ordenação
const listarNoticias = async (req, res) => {
    try {
        const {
            pagina = 1,
            itensPorPagina = 8,
            termoPesquisa = '',
            campoOrdenacao = 'data_publicacao', // Ordenar por data por padrão
            direcaoOrdenacao = 'desc'
        } = req.query;

        const where = {};
        if (termoPesquisa) {
            where[Op.or] = [
                { titulo: { [Op.like]: `%${termoPesquisa}%` } },
                { descricao: { [Op.like]: `%${termoPesquisa}%` } }
            ];
        }

        const offset = (parseInt(pagina) - 1) * parseInt(itensPorPagina);

        const { count, rows } = await Noticia.findAndCountAll({
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
        console.error('Erro ao buscar notícias:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// GET /:id - Buscar uma notícia específica
const buscarNoticiaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const noticia = await Noticia.findByPk(id);

        if (!noticia) {
            return res.status(404).json({ erro: 'Notícia não encontrada' });
        }
        res.json(noticia);
    } catch (error) {
        console.error('Erro ao buscar notícia:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// POST / - Criar nova notícia
const criarNoticia = async (req, res) => {
    try {
        const { titulo, descricao, data_publicacao } = req.body;
        
        if (!titulo || !descricao || !data_publicacao) {
            return res.status(400).json({ erro: 'Campos obrigatórios: titulo, descricao, data_publicacao' });
        }

        const novaNoticia = await Noticia.create({ titulo, descricao, data_publicacao });
        res.status(201).json(novaNoticia);
    } catch (error) {
        console.error('Erro ao criar notícia:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// PUT /:id - Atualizar notícia
const atualizarNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, data_publicacao } = req.body;

        const noticia = await Noticia.findByPk(id);
        if (!noticia) {
            return res.status(404).json({ erro: 'Notícia não encontrada' });
        }

        await noticia.update({ titulo, descricao, data_publicacao });
        res.json(noticia);
    } catch (error) {
        console.error('Erro ao atualizar notícia:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

// DELETE /:id - Excluir notícia
const excluirNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        const noticia = await Noticia.findByPk(id);
        if (!noticia) {
            return res.status(404).json({ erro: 'Notícia não encontrada' });
        }
        
        await noticia.destroy();
        res.json({ sucesso: true, mensagem: 'Notícia excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir notícia:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

module.exports = {
    listarNoticias,
    buscarNoticiaPorId,
    criarNoticia,
    atualizarNoticia,
    excluirNoticia
};  