import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LoginPage from './pages/Login';
import TabelaUsuariosPage from './pages/TabelaUsuarios';

import './App.css'; 
import './Login.css';
import './Tabela.css';

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/tabelaUsuarios" element={<TabelaUsuariosPage />} />

      <Route
        path="/login"
        element={
          <LoginPage
            onLoginSuccess={() => {
              console.log("Usuário autenticado!");
              navigate("/tabelaUsuarios");
            }}
          />
        }
      />
    </Routes>
  );
}

export default App;
