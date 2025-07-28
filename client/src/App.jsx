import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import TabelaUsuariosPage from './pages/TabelaUsuarios';

import './App.css'; // todo o css

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/tabelaUsuarios" element={<TabelaUsuariosPage/>}/>

    </Routes>
  );
}

export default App;
