// src/pages/Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Importa Link e useNavigate
import authService from '../services/authService';

function RegisterPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // 2. Hook para redirecionar após o sucesso

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.register({ usuario: usuario, senha: password });
      setIsLoading(false);
      alert('Usuário registrado com sucesso! Por favor, faça o login.');
      navigate('/login'); // 3. Redireciona para a página de login
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro.';
      setError(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>Criar Conta</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {/* ... (inputs de usuário e senha) ... */}
        <div className="input-group">
          <label htmlFor="usuario">Usuário (Email)</label>
          <input
            type="email"
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            placeholder="seuemail@exemplo.com"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Crie uma senha forte"
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
      <div className="toggle-link">
        Já tem uma conta?{' '}
        {/* 4. Usa o Link para voltar para a rota de login */}
        <Link to="/login">Faça Login</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
