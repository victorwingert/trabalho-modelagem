const Bloco = require('../models/Bloco');
const Apartamento = require('../models/Apartamento');

// Função para listar todos os blocos
const listarBlocos = async (req, res) => {
    try {
        // Busca todos os blocos e ordena pelo nome
        const blocos = await Bloco.findAll({
            order: [['nome', 'ASC']]
        });
        // Renomeia os campos para o frontend, se necessário
        const resultado = blocos.map(b => ({ id: b.id, nome: b.nome }));
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro ao buscar blocos:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};

// Função para listar todos os apartamentos
const listarApartamentos = async (req, res) => {
    try {
        // Busca todos os apartamentos, ordenando pelo número
        const apartamentos = await Apartamento.findAll({
            order: [['numero', 'ASC']]
        });
        // Renomeia os campos para corresponder ao que o frontend espera
        const resultado = apartamentos.map(ap => ({
            id: ap.id,
            numero: ap.numero,
            andar: ap.andar,
            id_bloco: ap.id_bloco // importante para o filtro do frontend
        }));
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro ao buscar apartamentos:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};

module.exports = {
    listarBlocos,
    listarApartamentos
};