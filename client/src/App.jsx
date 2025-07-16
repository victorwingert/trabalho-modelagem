// Register.jsx

import React, { useState } from 'react';

// O componente recebe uma função para alternar de volta para a tela de login
function Register({ onToggle }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Enviando dados de registro:', { nome, email, password });
    // Aqui você chamaria seu serviço de API para cadastrar o usuário
    // A API no backend receberia a senha, criaria o hash e salvaria no banco
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>Criar Conta</h1>
        <div className="input-group">
          <label htmlFor="nome">Nome Completo</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Seu nome completo"
          />
        </div>
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
            placeholder="Crie uma senha forte"
          />
        </div>
        <button type="submit" className="submit-button">
          Registrar
        </button>
      </form>
      <div className="toggle-link">
        Já tem uma conta?{' '}
        <button onClick={onToggle}>Faça Login</button>
      </div>
    </div>
  );
}

export default Register;
