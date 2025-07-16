import axios from 'axios';

// Define a URL base da sua API.
// Durante o desenvolvimento, será o endereço do seu servidor Node.js.
const API_URL = 'http://localhost:3001/api';

// Cria uma instância do axios com a URL base.
// Isso evita que você precise digitar a URL completa toda vez.
const api = axios.create({
  baseURL: API_URL,
});

/**
 * Função para registrar um novo usuário.
 * @param {object} userData - Dados do usuário { nome, email, senha }.
 * @returns {Promise} - A promessa da requisição axios.
 */
const register = (userData) => {
  // Faz uma requisição POST para o endpoint /register
  return api.post('/register', userData);
};

/**
 * Função para fazer login de um usuário.
 * @param {object} credentials - Credenciais do usuário { email, senha }.
 * @returns {Promise} - A promessa da requisição axios.
 */
const login = (credentials) => {
  return api.post('/login', credentials);
};

// Exporta as funções para que possam ser usadas em outros lugares da aplicação.
export default {
  register,
  login,
};
