// server/src/controllers/authController.js

const bcrypt = require('bcrypt');
// Importa o novo modelo 'Registro'
const Registro = require('../models/Registro');

// Função para registrar um novo usuário
exports.register = async (req, res) => {
  try {
    // Agora esperamos 'usuario' e 'senha' do corpo da requisição
    const { usuario, senha } = req.body;

    // Verifica se o usuário já existe
    const usuarioExistente = await Registro.findOne({ where: { Usuario: usuario } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Este usuário já está cadastrado.' });
    }

    // Cria o hash da senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Cria o registro no banco de dados com os campos corretos
    await Registro.create({
      Usuario: usuario,
      Senha: senhaHash,
      // O Nivel_Acesso usará o valor padrão 'usuario' definido no model
    });

    // Envia uma resposta de sucesso
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
  }
};
