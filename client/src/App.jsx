// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Importa os componentes de página da pasta 'pages'
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
// No futuro, você pode adicionar outras páginas aqui
// import DashboardPage from './pages/Dashboard';

import './App.css'; // Estilos do formulário

function App() {
  return (
    // 2. 'Routes' é o container para todas as suas rotas
    <Routes>
      {/* Rota inicial: redireciona para a página de login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Rota para a página de login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rota para a página de registro */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Exemplo de rota futura para o dashboard (protegida) */}
      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
    </Routes>
  );
}

export default App;
