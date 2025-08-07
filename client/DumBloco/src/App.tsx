import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LoginPage from './pages/Login';
import TabelaUsuariosPage from './pages/TabelaUsuarios';
import TabelaNoticiasPage from './pages/TabelaNoticias';
import TabelaPedidosPage from './pages/TabelaPedidos';
import TabelaProdutosPage from './pages/TabelaProdutos';


import './App.css'; 
import './Login.css';
import './Tabela.css';

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/tabelaUsuarios" element={<TabelaUsuariosPage />} />

      <Route path="/tabelaNoticias" element={<TabelaNoticiasPage />} />

      <Route path="/tabelaPedidos" element={<TabelaPedidosPage />} />

      <Route path="/tabelaProdutos" element={<TabelaProdutosPage />} />



      <Route
        path="/login"
        element={
          <LoginPage
            onLoginSuccess={() => {
              console.log("Usuário autenticado!");
              navigate("/tabelaProdutos");
            }}
          />
        }
      />
    </Routes>
  );
}

export default App;
