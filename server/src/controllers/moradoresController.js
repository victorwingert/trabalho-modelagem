
// Arquivo: src/controllers/moradoresController.js
// Model para LEITURA (usa a VIEW)
const Morador = require('../models/Morador');
// Model para ESCRITA (usa a TABELA FÍSICA)
const MoradorTabela = require('../models/moradorTabela');
const Entidade = require('../models/Entidade'); 
const sequelize = require('../config/database');
const { Op } = require('sequelize');

/**
 * LISTAR MORADORES (LEITURA)
 * Esta função usa o model 'Morador' que aponta para a VIEW,
 * pois é uma operação de apenas leitura.
 */
const listarMoradores = async (req, res) => {
    try {
        const {
            pagina = 1,
            itensPorPagina = 8,
            termoPesquisa = '',
            campoOrdenacao = 'nome',
            direcaoOrdenacao = 'asc',
            filtroBloco = '',
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

        const offset = (parseInt(pagina) - 1) * parseInt(itensPorPagina);

        const { count, rows } = await Morador.findAndCountAll({ // <-- USA A VIEW (LEITURA)
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

/**
 * BUSCAR MORADOR POR ID (LEITURA)
 * Esta função também usa o model 'Morador' (VIEW) para ler os dados de um único registro.
 */
const buscarMoradorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const morador = await Morador.findByPk(id); // <-- USA A VIEW (LEITURA)
        if (!morador) {
            return res.status(404).json({ erro: 'Morador não encontrado' });
        }
        res.json(morador);
    } catch (error) {
        console.error('Erro ao buscar morador:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

/**
 * CRIAR MORADOR (ESCRITA)
 * Esta função usa transações e os models das TABELAS FÍSICAS ('Entidade' e 'MoradorTabela')
 * para garantir a escrita segura dos dados.
 */
const criarMorador = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { nome, cpf, telefone, email, id_apartamento, tipo, id_entidade } = req.body;

        if (!nome || !cpf || !telefone || !id_apartamento) {
            await t.rollback();
            return res.status(400).json({ erro: 'Campos obrigatórios: nome, cpf, telefone, id_apartamento' });
        }

        let entidade;
        if (id_entidade) {
            await Entidade.update({ nome, cpf, telefone, email, tipo: tipo || 'Morador' }, { where: { id: id_entidade }, transaction: t });
            entidade = { id: id_entidade };
        } else {
            entidade = await Entidade.create({ nome, cpf, telefone, email, tipo: tipo || 'Morador' }, { transaction: t });
        }

        const novoMorador = await MoradorTabela.create({ // <-- USA A TABELA (ESCRITA)
            ID_Apartamento: id_apartamento,
            ID_Entidade: entidade.id
        }, { transaction: t });
        
        await t.commit();
        
        // Após a escrita, usa a VIEW para retornar o dado completo e formatado.
        const moradorCompleto = await Morador.findByPk(novoMorador.id); // <-- USA A VIEW (LEITURA)
        res.status(201).json(moradorCompleto);

    } catch (error) {
        await t.rollback();
        console.error('Erro ao criar morador:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ erro: 'Erro de duplicidade. O CPF ou outro campo único já está em uso.' });
        }
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

/**
 * ATUALIZAR MORADOR (ESCRITA)
 * Usa a VIEW para ler os dados iniciais e as TABELAS para efetuar as atualizações.
 */
const atualizarMorador = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { nome, cpf, telefone, email, id_apartamento, tipo } = req.body;

        const morador = await Morador.findByPk(id); // Usa a VIEW para ler os dados atuais
        if (!morador) {
            await t.rollback();
            return res.status(404).json({ erro: 'Morador não encontrado' });
        }

        await Entidade.update({ nome, cpf, telefone, email, tipo: tipo || 'Morador' }, { where: { id: morador.id_entidade }, transaction: t });

        if (id_apartamento) {
            await MoradorTabela.update({ ID_Apartamento: id_apartamento }, { where: { id: id }, transaction: t }); // <-- USA A TABELA (ESCRITA)
        }

        await t.commit();

        const moradorAtualizado = await Morador.findByPk(id); // Usa a VIEW para retornar o dado atualizado
        res.json(moradorAtualizado);

    } catch (error) {
        await t.rollback();
        console.error('Erro ao atualizar morador:', error);
        res.status(500).json({ erro: 'Erro interno do servidor', detalhes: error.message });
    }
};

/**
 * EXCLUIR MORADOR (ESCRITA)
 * Usa a VIEW para obter IDs e as TABELAS para realizar a exclusão de forma segura.
 */
const excluirMorador = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        
        const morador = await Morador.findByPk(id); // Usa a VIEW para obter o id_entidade
        if (!morador) {
            await t.rollback();
            return res.status(404).json({ erro: 'Morador não encontrado' });
        }

        const id_entidade = morador.id_entidade;

        await MoradorTabela.destroy({ where: { id: id }, transaction: t }); // <-- USA A TABELA (ESCRITA)

        const outrosMoradores = await MoradorTabela.count({ where: { ID_Entidade: id_entidade }, transaction: t }); // <-- USA A TABELA (ESCRITA)
        
        // Lógica para limpar a entidade se ela não for mais referenciada.
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