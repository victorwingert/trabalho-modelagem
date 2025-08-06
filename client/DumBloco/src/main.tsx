// import { StrictMode, useState } from 'react'
// import { createRoot } from 'react-dom/client'
// import '../app/globals.css'
// import LoginPage from "./pages/Login"
// import DashboardPage from "./pages/TabelaUsuarios"

// function MainApp() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)

//   const handleLoginSuccess = () => {
//     setIsLoggedIn(true)
//   }

//   return (
//     <StrictMode>
//       {isLoggedIn ? (
//         <DashboardPage />
//       ) : (
//         <LoginPage onLoginSuccess={handleLoginSuccess} />
//       )}
//     </StrictMode>
//   )
// }

// createRoot(document.getElementById('root')!).render(<MainApp />)

// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';

// import LoginPage from './pages/Login';
// import TabelaUsuariosPage from './pages/TabelaUsuarios';

// import './App.css'; 
// import './Login.css';
// import './Tabela.css';

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" />} />

//       <Route path="/login" element={<LoginPage />} />

//       <Route path="/tabelaUsuarios" element={<TabelaUsuariosPage/>}/>

//     </Routes>
//   );
// }

// export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


