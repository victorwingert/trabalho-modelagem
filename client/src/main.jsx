// main.jsx (ou index.jsx)

import React from 'react';
import ReactDOM from 'react-dom/client';

// Importa os estilos globais
import './index.css';

// Importa o componente principal da aplicação
import App from './App';

// Renderiza a aplicação no elemento com id 'root' do seu index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
