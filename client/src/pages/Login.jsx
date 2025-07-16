// src/pages/Login.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Importa o Link para navegação
import authService from '../services/authService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ... (estados de erro e loading)

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Lógica para fazer login...
    console.log('Tentando fazer login com:', { email, password });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {/* ... (inputs de email e senha) ... */}
         <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Sua senha"
          />
        </div>
        <button type="submit" className="submit-button">Entrar</button>
      </form>
      <div className="toggle-link">
        Não tem uma conta?{' '}
        {/* 2. Usa o Link para ir para a rota de registro */}
        <Link to="/register">Registre-se</Link>
      </div>
    </div>
  );
}

export default LoginPage;
