import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import authService from '../services/authService';
import logo from '../assets/Logo.svg';

function TabelaUsuariosPage() {
  
  return (
    <div>
      <aside className='sideBar-tabelaUsuarios'>

      </aside>
      <div className='background-tabelaUsuarios'>

        <div className='título-tabelaUsuarios'>
            <h1>Tabela de Usuários</h1>
        </div>

        <div className='conteúdo-tabelaUsuarios'>
          <div className='superior-tabelaUsuarios'></div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Bloco</th>
                <th>Apartamento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
                <tr >
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    
                  </td>
                </tr>
            </tbody>
          </table>

          <div className='paginacao-tabelaUsuarios'>

          </div>

        </div>
      </div>
    </div>
    
    
    
    /*
    <div className="conteudo-Login">
      
      <form onSubmit={handleSubmit}>
        <div className='conteudoPai-Login'>
          <h1>Login</h1>
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
    </div>*/
  );
}

export default TabelaUsuariosPage;
