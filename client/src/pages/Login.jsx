// src/pages/Login.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Importa o Link para navegação
import authService from '../services/authService';
import logo from '../assets/Logo.svg';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //(estados de erro e loading)

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Tentando fazer login com:', { email, password });
  };

  return (
    <div className='pagina-Login'> 
      <div className="conteudo-Login">
      <form onSubmit={handleSubmit}>
        <div className='conteudoPai-Login'>
          <h1>Login</h1>
          {/* ... (inputs de email e senha) ... */}
          <div className="input-Login">
            <label htmlFor="email"></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <div className="input-Login">
            <label htmlFor="password"></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="senha"
            />
          </div>
          <button type="submit" className="botao-Login">Entrar</button>
          
          <div className='imagem-Login'>
            <img src={logo} alt="Logo do Dum Bloco." />
          </div>
          <div className='indicaSindico-Login'>
            <p>Ainda não tem uma conta? 
              Contate seu síndico!</p>
          </div>
        </div>
      </form>
    </div>
  </div>
    
  );
}

export default LoginPage;
