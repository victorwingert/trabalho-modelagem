import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import authService from '../services/authService';
import logo from '../assets/Logo.svg';

function TabelaUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simula busca no banco de dados
  useEffect(() => {
    const dadosMock = [
      { id: 1, nome: 'seven9', bloco: 'A', apartamento: '101' },
      { id: 2, nome: '7nine', bloco: 'B', apartamento: '202' },
      { id: 2, nome: 'sevenin', bloco: 'B', apartamento: '202' },
      { id: 2, nome: 'pedro', bloco: 'B', apartamento: '202' },
      { id: 2, nome: 'caetano', bloco: 'B', apartamento: '202' },
    ];

    setTimeout(() => {
      setUsuarios(dadosMock);
      setLoading(false);
    }, 500);
  }, []);

  const handleEditar = (id) => {
    alert(`Editar usuário com id ${id}`);
    // Aqui você pode abrir um formulário/modal de edição
  };

  const handleExcluir = (id) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
    }
  };

  const handleAdicionar = () => {
    const novoUsuario = {
      id: Date.now(), // gera ID fictício
      nome: 'Novo Usuário',
      bloco: 'C',
      apartamento: '303',
    };
    setUsuarios((prev) => [...prev, novoUsuario]);
  };

  return (
      <div className='pagina-tabelaUsuarios'>
        <aside className='sideBar-tabelaUsuarios'>
          <a href="/login">
            <img className='logo' src={logo} alt="Logo do Dum Bloco." />
          </a>
          <a href="/login">
            <img className='imagem' src={logo} alt="Logo do Dum Bloco." />
          </a>
          <a href="/login">
            <img className='imagem' src={logo} alt="Logo do Dum Bloco." />
          </a>
          <a href="/login">
            <img className='imagem' src={logo} alt="Logo do Dum Bloco." />
          </a>
          <a href="/login">
            <img className='imagem' src={logo} alt="Logo do Dum Bloco." />
          </a>
          <a href="/login">
            <img className='imagem' src={logo} alt="Logo do Dum Bloco." />
          </a>
          <a href="/login">
            <img className='imagem' src={logo} alt="Logo do Dum Bloco." />
          </a>
        </aside>
        <div className='background-tabelaUsuarios'>
          <div className='titulo-tabelaUsuarios'>
              <h1>Tabela de Usuários</h1>
          </div>
          

          <div className='conteudo-tabelaUsuarios'>
<div className="pesquisa-tabelaUsuarios">
  <input type="text" placeholder="🔍 Search" />
  <button>CRIAR</button>
</div>
            <table className='tabela-usuarios'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Bloco</th>
                  <th>Apartamento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nome}</td>
                    <td>{usuario.bloco}</td>
                    <td>{usuario.apartamento}</td>
                    <td>
                      <button onClick={() => handleEditar(usuario.id)}>Editar</button>
                      <button onClick={() => handleExcluir(usuario.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="paginacao-tabelaUsuarios">
              <button>{'<'}</button>
              <button className="ativo">1</button>
              <button>2</button>
              <button>3</button>
              <button>{'>'}</button>
            </div>


          </div>
        </div>
      </div>
    
  );
}

export default TabelaUsuariosPage;
