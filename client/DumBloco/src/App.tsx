import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LoginPage from './pages/Login';
import TabelaUsuariosPage from './pages/TabelaUsuarios';
import TabelaNoticiasPage from './pages/TabelaNoticias';
import TabelaPedidosPage from './pages/TabelaPedidos';
import TabelaProdutosPage from './pages/TabelaProdutos';
import TabelaMoradoresPage from './pages/TabelaMoradores';
import ProtectedRoute from './components/ProtectedRoute';


import './App.css';
import './Login.css';
import './Tabela.css';

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="/login"
        element={
          <LoginPage
            onLoginSuccess={() => {
              console.log("Usuário autenticado! Redirecionando...");
              navigate("/tabelaMoradores");
            }}
          />
        }
      />


      {/* As rotas aqui dentro são protegidas e verificam o nível de acesso */}
      <Route element={<ProtectedRoute />}>
        <Route path="/tabelaUsuarios" element={<TabelaUsuariosPage />} />
        <Route path="/tabelaNoticias" element={<TabelaNoticiasPage />} />
        <Route path="/tabelaPedidos" element={<TabelaPedidosPage />} />
        <Route path="/tabelaProdutos" element={<TabelaProdutosPage />} />
        <Route path="/tabelaMoradores" element={<TabelaMoradoresPage />} />

        {/* Placeholders para as rotas futuras. */}
        {/*
        <Route path="/tabelaBlocos" element={<div>Página Tabela de Blocos</div>} />
        <Route path="/registroFuncionarioMorador" element={<div>Página de Registro de Funcionário/Morador</div>} />
        <Route path="/registroSindicoAdmin" element={<div>Página de Registro de Síndico/Admin</div>} />
        */}
      </Route>

    </Routes>
  );
}

export default App;