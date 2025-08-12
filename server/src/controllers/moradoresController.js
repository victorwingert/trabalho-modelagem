const Morador = require('../models/Morador');
const Apartamento = require('../models/Apartamento');
const Bloco = require('../models/Bloco');
const Entidade = require('../models/Entidade');
const { Op, Sequelize } = require('sequelize');

// Função para obter todos os moradores com filtros, paginação e ordenação
exports.getAll = async (req, res) => {
  try {
    // Extrai os parâmetros da requisição com valores padrão
    const {
      pagina = 1,
      itensPorPagina = 8,
      termoPesquisa = '',
      campoOrdenacao = 'nome',
      direcaoOrdenacao = 'asc',
      filtroBloco = '',
      filtroEntidade = '',
    } = req.query;

    const offset = (pagina - 1) * itensPorPagina;
    let where = {}; // Objeto para as condições da cláusula WHERE principal

    // Define as associações que serão incluídas na consulta
    const include = [
      {
        model: Apartamento,
        as: 'Apartamento',
        include: [{
          model: Bloco,
          as: 'Bloco',
        }],
      },
      {
        model: Entidade,
        as: 'Entidade',
        required: true, // Garante que todo morador tenha uma entidade (INNER JOIN)
      },
    ];

    // CORREÇÃO: A pesquisa agora busca nos campos da tabela Entidade
    if (termoPesquisa) {
      where[Op.or] = [
        // Pesquisa nos campos da Entidade associada
        Sequelize.where(Sequelize.col('Entidade.nome'), { [Op.like]: `%${termoPesquisa}%` }),
        Sequelize.where(Sequelize.col('Entidade.cpf'), { [Op.like]: `%${termoPesquisa}%` }),
        Sequelize.where(Sequelize.col('Entidade.telefone'), { [Op.like]: `%${termoPesquisa}%` }),
        // Mantém a pesquisa em outros campos relevantes
        Sequelize.where(Sequelize.col('Apartamento.numero'), { [Op.like]: `%${termoPesquisa}%` }),
        Sequelize.where(Sequelize.col('Apartamento.Bloco.nome'), { [Op.like]: `%${termoPesquisa}%` }),
      ];
    }

    // Adiciona filtro por entidade na cláusula WHERE principal
    if (filtroEntidade) {
      where.id_entidade = filtroEntidade;
    }

    // Adiciona filtro por bloco diretamente na associação aninhada
    if (filtroBloco) {
      include[0].include[0].where = { id: filtroBloco };
      include[0].required = true;
      include[0].include[0].required = true;
    }
    
    // CORREÇÃO: O mapa de ordenação agora aponta para a tabela Entidade
    const orderMap = {
        id: [['id', direcaoOrdenacao]], // Morador.id
        nome: [[Sequelize.col('Entidade.nome'), direcaoOrdenacao]],
        cpf: [[Sequelize.col('Entidade.cpf'), direcaoOrdenacao]],
        telefone: [[Sequelize.col('Entidade.telefone'), direcaoOrdenacao]],
        numeroApartamento: [[Sequelize.col('Apartamento.numero'), direcaoOrdenacao]],
        andar: [[Sequelize.col('Apartamento.andar'), direcaoOrdenacao]],
        nomeBloco: [[Sequelize.col('Apartamento.Bloco.nome'), direcaoOrdenacao]],
        nomeEntidade: [[Sequelize.col('Entidade.nome'), direcaoOrdenacao]],
    };

    // A ordenação padrão agora é pelo nome da entidade
    const order = orderMap[campoOrdenacao] || [[Sequelize.col('Entidade.nome'), 'asc']];

    // Executa a consulta principal
    const { count, rows } = await Morador.findAndCountAll({
      where,
      include,
      order,
      limit: parseInt(itensPorPagina),
      offset,
      distinct: true,
    });

    // CORREÇÃO: Mapeia os dados a partir das fontes corretas (Morador, Entidade, Apartamento)
    const dados = rows.map(m => ({
      id: m.id, // ID da tabela Moradores
      // Dados pessoais da tabela Entidade
      nome: m.Entidade?.nome,
      cpf: m.Entidade?.cpf,
      telefone: m.Entidade?.telefone,
      email: m.Entidade?.email, // Assumindo que o email também está em Entidade
      // IDs da tabela Moradores
      id_apartamento: m.id_apartamento,
      id_entidade: m.id_entidade,
      // Dados do Apartamento e Bloco
      numeroApartamento: m.Apartamento?.numero,
      andar: m.Apartamento?.andar,
      id_bloco: m.Apartamento?.id_bloco,
      nomeBloco: m.Apartamento?.Bloco?.nome, // Certifique-se que o nome do campo no modelo é 'nome'
      descricaoBloco: m.Apartamento?.Bloco?.descricao,
      // Dados da Entidade (pode ser útil ter no objeto final)
      nomeEntidade: m.Entidade?.nome,
      tipoEntidade: m.Entidade?.tipo,
    }));

    // Retorna a resposta paginada em formato JSON
    res.json({
      dados,
      totalItens: count,
      totalPaginas: Math.ceil(count / itensPorPagina),
      paginaAtual: parseInt(pagina),
      itensPorPagina: parseInt(itensPorPagina),
    });

  } catch (err) {
    console.error('Erro detalhado ao buscar moradores:', err);
    res.status(500).json({ error: 'Erro ao buscar moradores', details: err.message });
  }
};

// As outras funções (create, update, delete) permanecem as mesmas
exports.create = async (req, res) => {
  try {
    const novo = await Morador.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar morador' });
  }
};

exports.update = async (req, res) => {
  try {
    await Morador.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Morador atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar morador' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Morador.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Morador excluído' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir morador' });
  }
};
