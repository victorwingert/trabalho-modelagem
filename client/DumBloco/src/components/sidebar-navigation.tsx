import React from 'react';
import { useAuth } from './ProtectedRoute';
import { PERMISSIONS } from '../config/permissions';

import logo from '../assets/Logo.svg';
import property from '../assets/property.svg';
import alert from '../assets/bell.svg';
import quit from '../assets/quit.svg';
import products from '../assets/archive.svg';
import task from '../assets/align.svg';
import accessibility from '../assets/accessibility.svg';
import key from '../assets/key.svg';
import square_user from '../assets/square_user.svg';

interface SidebarNavigationProps {
  sidebarAberta: boolean;
  toggleSidebar: () => void;
  currentPage?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  sidebarAberta, 
  toggleSidebar, 
  currentPage 
}) => {
  const { nivelAcesso } = useAuth();

  const allMenuItems = [
    { href: "/tabelaNoticias", label: "Home", icon: logo },
    { href: "/tabelaPedidos", label: "Pedidos", icon: task },
    { href: "/tabelaProdutos", label: "Produtos", icon: products },
    { href: "/tabelaBlocos", label: "Blocos", icon: property },
    { href: "/tabelaNoticias", label: "Notícias", icon: alert },
    { href: "/tabelaMoradores", label: "Moradores", icon: accessibility },
    { href: "/tabelaFuncionarios", label: "Funcionarios", icon: key },
    { href: "/tabelaProprietarios", label: "Proprietarios", icon: square_user },


    // novas paginas com placeholders
    // { href: "/registroFuncionarioMorador", label: "Registrar Funcionário/Morador", icon: someIcon },
    // { href: "/registroSindicoAdmin", label: "Registrar Síndico/Admin", icon: someIcon },
  ];

  const menuItems = allMenuItems.filter(item => {
    const allowedRoles = PERMISSIONS[item.href];
    if (!allowedRoles) return false;
    return nivelAcesso !== null && allowedRoles.includes(nivelAcesso);
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
  };

  return (
    <aside className={`sideBar-tabelaUsuarios ${sidebarAberta ? 'aberta' : 'fechada'}`}>
      <button onClick={toggleSidebar} className="botao-toggle-sidebar">
        {sidebarAberta ? '⮜' : '⮞'}
      </button>
      
      {menuItems.map((item, index) => (
        <a 
          key={index}
          href={item.href} 
          className={`item-sidebar ${currentPage === item.href ? 'active' : ''}`}
        >
          <img 
            className='imagem' 
            src={item.icon || "/placeholder.svg"} 
            alt={`Ícone de ${item.label}`} 
          />
          {sidebarAberta && <span className="texto-sidebar">{item.label}</span>}
        </a>
      ))}
      
      <a href="/login" className="itemLogout-sidebar" onClick={handleLogout}>
        <img 
          className='imagem' 
          src={quit || "/placeholder.svg"} 
          alt="Ícone de sair" 
        />
        {sidebarAberta && <span className="texto-sidebar">Logout</span>}
      </a>
    </aside>
  );
};

export default SidebarNavigation;