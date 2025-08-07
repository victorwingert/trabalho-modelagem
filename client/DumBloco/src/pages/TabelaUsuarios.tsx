import React, { useEffect, useState } from 'react';
//import { Link } from 'react-router-dom';
import logo from '../assets/Logo.svg';
import SidebarNavigation from '../components/sidebar-navigation';

interface Usuario {
    id: number;
    nome: string;
    bloco: string;
    apartamento: string;
}

type TipoModal = 'criar' | 'editar' | 'excluir' | 'visualizar' | null;

interface TabelaUsuariosPageProps {}

const TabelaUsuariosPage: React.FC<TabelaUsuariosPageProps> = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [tipoModal, setTipoModal] = useState<TipoModal>(null);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
    const [sidebarAberta, setSidebarAberta] = useState<boolean>(false);

    const toggleSidebar = (): void => setSidebarAberta((prev) => !prev);
    
    const abrirModalCriar = (): void => {
        setTipoModal('criar');
        setUsuarioSelecionado(null);
    };

    const abrirModalEditar = (usuario: Usuario): void => {
        setTipoModal('editar');
        setUsuarioSelecionado(usuario);
    };

    const abrirModalExcluir = (usuario: Usuario): void => {
        setTipoModal('excluir');
        setUsuarioSelecionado(usuario);
    };

    const abrirModalVisualizar = (usuario: Usuario): void => {
        setTipoModal('visualizar');
        setUsuarioSelecionado(usuario);
    };

    const fecharModal = (): void => {
        setTipoModal(null);
        setUsuarioSelecionado(null);
    };

    useEffect(() => {
        const dadosMock: Usuario[] = [
            { id: 1, nome: 'seven9', bloco: 'A', apartamento: '101' },
            { id: 2, nome: '7nine', bloco: 'B', apartamento: '202' },
            { id: 3, nome: 'sevenin', bloco: 'B', apartamento: '202' },
            { id: 4, nome: 'pedro', bloco: 'B', apartamento: '202' },
            { id: 5, nome: 'caetano', bloco: 'B', apartamento: '202' },
        ];

        setTimeout(() => {
            setUsuarios(dadosMock);
            setLoading(false);
        }, 500);
    }, []);

    const handleEditar = (id: number): void => {
        alert(`Editar usuário com id ${id}`);
    };

    const handleExcluir = (id: number): void => {
        if (confirm('Tem certeza que deseja excluir?')) {
            setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
        }
    };

    const handleSalvarUsuario = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const novoUsuario: Usuario = {
            id: Date.now(),
            nome: formData.get('nome') as string,
            bloco: 'C',
            apartamento: '303',
        };
        setUsuarios((prev) => [...prev, novoUsuario]);
        fecharModal();
    };

    return (
        <div className='pagina-tabelaUsuarios'>
            {/********************* Sidebar *******************/}
            <SidebarNavigation 
                            sidebarAberta={sidebarAberta}
                            toggleSidebar={toggleSidebar}
                            currentPage="/tabelaProdutos"
            />

            {/********************* titulo *******************/}
            <div className='background-tabelaUsuarios'>
                <div className='titulo-tabelaUsuarios'>
                    <h1>Tabela de Usuários</h1>
                </div>

                <div className='conteudo-tabelaUsuarios'>
                    {/********************* pesquisa e criar *******************/}
                    <div className="pesquisa-tabelaUsuarios">
                        <input type="text" placeholder="Search" />
                        <button onClick={abrirModalCriar}>Criar</button>
                    </div>

                    {/********************* tabela *******************/}
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
                                        <button onClick={() => abrirModalEditar(usuario)}>Editar</button>
                                        <button onClick={() => abrirModalExcluir(usuario)}>Excluir</button>
                                        <button onClick={() => abrirModalVisualizar(usuario)}>Visualizar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/********************* paginacao *******************/}

                    <div className="paginacao-tabelaUsuarios">
                        <button>{'⮜'}</button>
                        <button className="ativo">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>{'⮞'}</button>
                    </div>
                </div>
            </div>

            {/********************* Modal *******************/}
            {tipoModal && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-conteudo" onClick={(e: React.MouseEvent) => e.stopPropagation()} >
                        {tipoModal === 'excluir' ? (
                            <>
                                <h2>Confirmar exclusão</h2>
                                <br />
                                <p>Tem certeza que deseja excluir o usuário <strong>{usuarioSelecionado?.nome}</strong>?</p>
                                <br />
                                <div className='modal-botoes'>
                                    <button 
                                        type="submit"
                                        onClick={() => {
                                            if (usuarioSelecionado) {
                                                setUsuarios((prev) =>
                                                    prev.filter((u) => u.id !== usuarioSelecionado.id)
                                                );
                                            }
                                            fecharModal();
                                        }}
                                    >
                                        Confirmar
                                    </button>
                                    <button type="button" onClick={fecharModal}>Cancelar</button>
                                </div>
                            </>
                        ) : tipoModal === 'visualizar' ? (
                            <>
                                <h2>Informações do Usuário</h2>
                                <br />
                                <p><strong>ID:</strong> {usuarioSelecionado?.id}</p>
                                <p><strong>Nome:</strong> {usuarioSelecionado?.nome}</p>
                                <p><strong>Bloco:</strong> {usuarioSelecionado?.bloco}</p>
                                <p><strong>Apartamento:</strong> {usuarioSelecionado?.apartamento}</p>
                                <br />
                                <div className='modal-botoes'>
                                    <button type="button" onClick={fecharModal}>Fechar</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>{tipoModal === 'criar' ? 'Criar Novo Usuário' : 'Editar Usuário'}</h2>
                                <br />
                                <form
                                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                        e.preventDefault();
                                        const form = e.target as HTMLFormElement;
                                        const formData = new FormData(form);
                                        
                                        const novoUsuario: Usuario = {
                                            id: tipoModal === 'criar' ? Date.now() : usuarioSelecionado?.id || 0,
                                            nome: formData.get('nome') as string,
                                            bloco: 'C',
                                            apartamento: '303',
                                        };

                                        if (tipoModal === 'criar') {
                                            setUsuarios((prev) => [...prev, novoUsuario]);
                                        } else {
                                            setUsuarios((prev) =>
                                                prev.map((u) =>
                                                    u.id === novoUsuario.id ? novoUsuario : u
                                                )
                                            );
                                        }

                                        fecharModal();
                                    }}
                                >
                                    <label>
                                        Nome:
                                        <input
                                            name="nome"
                                            defaultValue={usuarioSelecionado?.nome || ''}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Email:
                                        <input name="email" type="email" required />
                                    </label>
                                    <label>
                                        Senha:
                                        <input name="senha" required />
                                    </label>
                                    <label>
                                        Bloco:
                                        <input name="bloco" required />
                                    </label>
                                    <label>
                                        Apartamento:
                                        <input name="apartamento" required />
                                    </label>
                                    <br />
                                    <div className='modal-botoes'>
                                        <button type="submit">Salvar</button>
                                        <button type="button" onClick={fecharModal}>
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TabelaUsuariosPage;
