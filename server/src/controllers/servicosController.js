const Servico = require('../models/Servico'); // Ajuste o caminho conforme sua estrutura

// Função para listar todos os serviços
exports.listarServicos = async (req, res) => {
  try {
    const servicos = await Servico.findAll({
      order: [['servico_id', 'DESC']] // Ordena por ID decrescente (mais recentes primeiro)
    });
    
    // Formatar os dados para o frontend
    const servicosFormatados = servicos.map(servico => ({
      id: servico.servico_id,
      tipo_servico: servico.tipo_servico,
      descricao: servico.descricrao, // Note: mantém o nome original da coluna
      data_solicitacao: servico.data_solicitacao,
      data_conclusao: servico.data_execucao, // Mapeia data_execucao para data_conclusao no frontend
      status: servico.status,
      morador_id: servico.morador_id,
      funcionario_id: servico.funcionario_id,
      // Campos temporários até implementar relacionamentos
      nome_morador: 'Nome do Morador', // TODO: Implementar join com tabela de moradores
      apartamento: 'Apartamento' // TODO: Implementar join com tabela de apartamentos
    }));

    res.json(servicosFormatados);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para buscar serviço por ID
exports.buscarServicoPorId = async (req, res) => {
  try {
    const servico = await Servico.findByPk(req.params.id);
    
    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    const servicoFormatado = {
      id: servico.servico_id,
      tipo_servico: servico.tipo_servico,
      descricao: servico.descricrao,
      data_solicitacao: servico.data_solicitacao,
      data_conclusao: servico.data_execucao,
      status: servico.status,
      morador_id: servico.morador_id,
      funcionario_id: servico.funcionario_id,
      nome_morador: 'Nome do Morador', // TODO: Implementar join
      apartamento: 'Apartamento' // TODO: Implementar join
    };

    res.json(servicoFormatado);
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para criar novo serviço
exports.criarServico = async (req, res) => {
  try {
    const {
      tipo_servico,
      descricao,
      data_solicitacao,
      data_conclusao,
      status,
      morador_id,
      funcionario_id
    } = req.body;

    // Validações básicas
    if (!tipo_servico || !descricao || !data_solicitacao) {
      return res.status(400).json({ message: 'Tipo de serviço, descrição e data de solicitação são obrigatórios.' });
    }

    const novoServico = await Servico.create({
      tipo_servico: tipo_servico,
      descricrao: descricao, // Note: nome original da coluna
      data_solicitacao: data_solicitacao,
      data_execucao: data_conclusao || null,
      status: status || 'Pendente',
      morador_id: morador_id || null,
      funcionario_id: funcionario_id || null
    });

    const servicoFormatado = {
      id: novoServico.servico_id,
      tipo_servico: novoServico.tipo_servico,
      descricao: novoServico.descricrao,
      data_solicitacao: novoServico.data_solicitacao,
      data_conclusao: novoServico.data_execucao,
      status: novoServico.status,
      morador_id: novoServico.morador_id,
      funcionario_id: novoServico.funcionario_id
    };

    res.status(201).json({ message: 'Serviço criado com sucesso!', servico: servicoFormatado });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para atualizar serviço
exports.atualizarServico = async (req, res) => {
  try {
    const {
      tipo_servico,
      descricao,
      data_solicitacao,
      data_conclusao,
      status,
      morador_id,
      funcionario_id
    } = req.body;

    const servico = await Servico.findByPk(req.params.id);
    
    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    // Validações básicas
    if (!tipo_servico || !descricao || !data_solicitacao) {
      return res.status(400).json({ message: 'Tipo de serviço, descrição e data de solicitação são obrigatórios.' });
    }

    await servico.update({
      tipo_servico: tipo_servico,
      descricrao: descricao,
      data_solicitacao: data_solicitacao,
      data_execucao: data_conclusao || null,
      status: status,
      morador_id: morador_id,
      funcionario_id: funcionario_id
    });

    const servicoFormatado = {
      id: servico.servico_id,
      tipo_servico: servico.tipo_servico,
      descricao: servico.descricrao,
      data_solicitacao: servico.data_solicitacao,
      data_conclusao: servico.data_execucao,
      status: servico.status,
      morador_id: servico.morador_id,
      funcionario_id: servico.funcionario_id
    };

    res.json({ message: 'Serviço atualizado com sucesso!', servico: servicoFormatado });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para excluir serviço
exports.excluirServico = async (req, res) => {
  try {
    const servico = await Servico.findByPk(req.params.id);
    
    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    await servico.destroy();
    res.status(200).json({ message: 'Serviço excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};