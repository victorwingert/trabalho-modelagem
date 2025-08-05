import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/Login';
import TabelaUsuariosPage from './pages/TabelaUsuarios';

import './App.css'; 
import './Login.css';
import './Tabela.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/tabelaUsuarios" element={<TabelaUsuariosPage/>}/>

    </Routes>
  );
}

export default App;
