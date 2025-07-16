const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario'); // Seu modelo de usuário

exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // 1. Define o "custo" do hash (salt rounds). 10 é um bom padrão.
    const saltRounds = 10;

    // 2. Gera o hash da senha de forma assíncrona
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // 3. Salva o usuário no banco com a SENHA HASHED
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash, // <-- MUITO IMPORTANTE: Salve o hash, não a senha original
    });

    // Não retorne a senha hashed na resposta por segurança
    novoUsuario.senha = undefined; 

    res.status(201).json({ message: "Usuário criado com sucesso!", usuario: novoUsuario });

  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário.", error });
  }
};