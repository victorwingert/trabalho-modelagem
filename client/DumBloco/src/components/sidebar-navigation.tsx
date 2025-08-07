import React from 'react';
import logo from '../assets/Logo.svg';
import property from '../assets/property.svg';
import alert from '../assets/alert.svg';
import quit from '../assets/quit.svg';
import products from '../assets/products.svg';
import task from '../assets/task.svg';
import user from '../assets/user.svg';

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
  const menuItems = [
    { href: "/login", label: "Home", icon: logo },
    { href: "/tabelaUsuarios", label: "Usuários", icon: user },
    { href: "/tabelaPedidos", label: "Pedidos", icon: task },
    { href: "/tabelaProdutos", label: "Produtos", icon: products },
    { href: "/tabelaBlocos", label: "Blocos", icon: property },
    { href: "/tabelaNoticias", label: "Notícias", icon: alert },
  ];

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
            alt="Logo do Dum Bloco." 
          />
          {sidebarAberta && <span className="texto-sidebar">{item.label}</span>}
        </a>
      ))}
      
      <a href="/login" className="itemLogout-sidebar">
        <img 
          className='imagem' 
          src={quit || "/placeholder.svg"} 
          alt="Logo do Dum Bloco." 
        />
        {sidebarAberta && <span className="texto-sidebar">Logout</span>}
      </a>
    </aside>
  );
};

export default SidebarNavigation;