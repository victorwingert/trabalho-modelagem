const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Registro = require('../models/Registro');

// Função para registrar um novo usuário
exports.register = async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const usuarioExistente = await Registro.findOne({ where: { Usuario: usuario } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Este usuário já está cadastrado.' });
    }
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    await Registro.create({
      Usuario: usuario,
      Senha: senhaHash,
    });
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
  }
};

// Função para fazer login (VERSÃO CORRIGIDA)
exports.login = async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    const usuarioEncontrado = await Registro.findOne({ where: { Usuario: usuario } });

    if (!usuarioEncontrado) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.Senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    // Geração do token com o nível de acesso
    const token = jwt.sign(
      { 
        id: usuarioEncontrado.ID, 
        usuario: usuarioEncontrado.Usuario,
        nivelAcesso: usuarioEncontrado.Nivel_Acesso // Essencial para as permissões
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Envia o token na resposta
    res.status(200).json({ message: 'Login realizado com sucesso!', token });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};