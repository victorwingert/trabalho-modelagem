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

// função para fazer login
exports.login = async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    // Procura o usuário pelo nome
    const usuarioEncontrado = await Registro.findOne({ where: { Usuario: usuario } });

    if (!usuarioEncontrado) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    // Compara a senha enviada com o hash armazenado
    const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.Senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    res.status(200).json({ message: 'Login realizado com sucesso!' });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};
