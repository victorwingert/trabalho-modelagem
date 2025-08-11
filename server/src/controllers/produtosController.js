const Produto = require('../models/Produto'); // Ajuste o caminho conforme sua estrutura

// Função para listar todos os produtos
exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      order: [['ID', 'DESC']] // Ordena por ID decrescente (mais recentes primeiro)
    });
    
    // Formatar os dados para o frontend
    const produtosFormatados = produtos.map(produto => ({
      id: produto.ID,
      nome: produto.Nome_Produto,
      descricao: produto.Descricao,
      categoria: produto.Categoria,
      preco: parseFloat(produto.Preco),
      quantidade_estoque: produto.Quantidade_Estoque,
      data_cadastro: produto.Data_Cadastro,
      status: produto.Status,
      fornecedor: produto.Fornecedor
    }));

    res.json(produtosFormatados);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para buscar produto por ID
exports.buscarProdutoPorId = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const produtoFormatado = {
      id: produto.ID,
      nome: produto.Nome_Produto,
      descricao: produto.Descricao,
      categoria: produto.Categoria,
      preco: parseFloat(produto.Preco),
      quantidade_estoque: produto.Quantidade_Estoque,
      data_cadastro: produto.Data_Cadastro,
      status: produto.Status,
      fornecedor: produto.Fornecedor
    };

    res.json(produtoFormatado);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para criar novo produto
exports.criarProduto = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      categoria,
      preco,
      quantidade_estoque,
      data_cadastro,
      status,
      fornecedor
    } = req.body;

    // Validações básicas
    if (!nome || !descricao || !categoria || !preco || quantidade_estoque === undefined || !fornecedor) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    const novoProduto = await Produto.create({
      Nome_Produto: nome,
      Descricao: descricao,
      Categoria: categoria,
      Preco: preco,
      Quantidade_Estoque: quantidade_estoque,
      Data_Cadastro: data_cadastro || new Date().toISOString().split('T')[0],
      Status: status || 'Ativo',
      Fornecedor: fornecedor
    });

    const produtoFormatado = {
      id: novoProduto.ID,
      nome: novoProduto.Nome_Produto,
      descricao: novoProduto.Descricao,
      categoria: novoProduto.Categoria,
      preco: parseFloat(novoProduto.Preco),
      quantidade_estoque: novoProduto.Quantidade_Estoque,
      data_cadastro: novoProduto.Data_Cadastro,
      status: novoProduto.Status,
      fornecedor: novoProduto.Fornecedor
    };

    res.status(201).json({ message: 'Produto criado com sucesso!', produto: produtoFormatado });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para atualizar produto
exports.atualizarProduto = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      categoria,
      preco,
      quantidade_estoque,
      data_cadastro,
      status,
      fornecedor
    } = req.body;

    const produto = await Produto.findByPk(req.params.id);
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    // Validações básicas
    if (!nome || !descricao || !categoria || !preco || quantidade_estoque === undefined || !fornecedor) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    await produto.update({
      Nome_Produto: nome,
      Descricao: descricao,
      Categoria: categoria,
      Preco: preco,
      Quantidade_Estoque: quantidade_estoque,
      Data_Cadastro: data_cadastro,
      Status: status,
      Fornecedor: fornecedor
    });

    const produtoFormatado = {
      id: produto.ID,
      nome: produto.Nome_Produto,
      descricao: produto.Descricao,
      categoria: produto.Categoria,
      preco: parseFloat(produto.Preco),
      quantidade_estoque: produto.Quantidade_Estoque,
      data_cadastro: produto.Data_Cadastro,
      status: produto.Status,
      fornecedor: produto.Fornecedor
    };

    res.json({ message: 'Produto atualizado com sucesso!', produto: produtoFormatado });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para excluir produto
exports.excluirProduto = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    await produto.destroy();
    res.status(200).json({ message: 'Produto excluído com sucesso!' }); // Seguindo seu padrão de sempre retornar message
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};