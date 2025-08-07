import React, { useEffect, useState } from 'react';
import logo from '../assets/Logo.svg';
import SidebarNavigation from '../components/sidebar-navigation';


interface Noticia {
    id: number;
    texto: string;
    data: string;
}

type TipoModal = 'criar' | 'editar' | 'excluir' | 'visualizar' | null;

const TabelaNoticiasPage: React.FC = () => {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [tipoModal, setTipoModal] = useState<TipoModal>(null);
    const [noticiaSelecionada, setNoticiaSelecionada] = useState<Noticia | null>(null);
    const [sidebarAberta, setSidebarAberta] = useState<boolean>(false);
    
    const toggleSidebar = (): void => setSidebarAberta((prev) => !prev);

    const abrirModalCriar = () => {
        setTipoModal('criar');
        setNoticiaSelecionada(null);
    };

    const abrirModalEditar = (noticia: Noticia) => {
        setTipoModal('editar');
        setNoticiaSelecionada(noticia);
    };

    const abrirModalExcluir = (noticia: Noticia) => {
        setTipoModal('excluir');
        setNoticiaSelecionada(noticia);
    };

    const abrirModalVisualizar = (noticia: Noticia) => {
        setTipoModal('visualizar');
        setNoticiaSelecionada(noticia);
    };

    const fecharModal = () => {
        setTipoModal(null);
        setNoticiaSelecionada(null);
    };

    useEffect(() => {
        const dadosMock: Noticia[] = [
            { id: 1, texto: 'Inauguração do novo bloco.', data: '2025-08-01' },
            { id: 2, texto: 'Manutenção programada para amanhã.', data: '2025-08-03' },
            { id: 3, texto: 'Reunião do condomínio na sexta.', data: '2025-08-05' },
        ];
        setTimeout(() => {
            setNoticias(dadosMock);
            setLoading(false);
        }, 500);
    }, []);

    const handleSalvarNoticia = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const novaNoticia: Noticia = {
            id: tipoModal === 'criar' ? Date.now() : noticiaSelecionada?.id || 0,
            texto: formData.get('texto') as string,
            data: formData.get('data') as string,
        };

        if (tipoModal === 'criar') {
            setNoticias((prev) => [...prev, novaNoticia]);
        } else {
            setNoticias((prev) =>
                prev.map((n) => (n.id === novaNoticia.id ? novaNoticia : n))
            );
        }

        fecharModal();
    };

    const handleExcluir = (id: number) => {
        if (confirm('Deseja excluir esta notícia?')) {
            setNoticias((prev) => prev.filter((n) => n.id !== id));
        }
    };

    return (
        <div className="pagina-tabelaUsuarios">
            {/********************* Sidebar *******************/}
            <SidebarNavigation 
                            sidebarAberta={sidebarAberta}
                            toggleSidebar={toggleSidebar}
                            currentPage="/tabelaNoticias"
            />

            {/********************* titulo *******************/}
            <div className='background-tabelaUsuarios'>
                <div className='titulo-tabelaUsuarios'>
                    <h1>Tabela de Notícias</h1>
                </div>

                <div className='conteudo-tabelaUsuarios'>
                    {/********************* pesquisa e criar *******************/}
                    <div className="pesquisa-tabelaUsuarios">
                        <input type="text" placeholder="Search" />
                        <button onClick={abrirModalCriar}>Criar</button>
                    </div>

                    {/********************* tabela *******************/}
                    <table className="tabela-usuarios">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Texto</th>
                                <th>Data</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {noticias.map((noticia) => (
                                <tr key={noticia.id}>
                                    <td>{noticia.id}</td>
                                    <td>{noticia.texto}</td>
                                    <td>{noticia.data}</td>
                                    <td>
                                        <button onClick={() => abrirModalEditar(noticia)}>Editar</button>
                                        <button onClick={() => abrirModalExcluir(noticia)}>Excluir</button>
                                        <button onClick={() => abrirModalVisualizar(noticia)}>Visualizar</button>
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

            {tipoModal && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
                        {tipoModal === 'excluir' ? (
                            <>
                                <h2>Confirmar Exclusão</h2>
                                <p>Deseja excluir a notícia <strong>{noticiaSelecionada?.texto}</strong>?</p>
                                <button onClick={() => { handleExcluir(noticiaSelecionada!.id); fecharModal(); }}>Confirmar</button>
                                <button onClick={fecharModal}>Cancelar</button>
                            </>
                        ) : tipoModal === 'visualizar' ? (
                            <>
                                <h2>Visualizar Notícia</h2>
                                <p><strong>ID:</strong> {noticiaSelecionada?.id}</p>
                                <p><strong>Texto:</strong> {noticiaSelecionada?.texto}</p>
                                <p><strong>Data:</strong> {noticiaSelecionada?.data}</p>
                                <button onClick={fecharModal}>Fechar</button>
                            </>
                        ) : (
                            <>
                                <h2>{tipoModal === 'criar' ? 'Criar Nova Notícia' : 'Editar Notícia'}</h2>
                                <form onSubmit={handleSalvarNoticia}>
                                    <label>
                                        Texto:
                                        <textarea name="texto" defaultValue={noticiaSelecionada?.texto || ''} required />
                                    </label>
                                    <label>
                                        Data:
                                        <input type="date" name="data" defaultValue={noticiaSelecionada?.data || ''} required />
                                    </label>
                                    <button type="submit">Salvar</button>
                                    <button type="button" onClick={fecharModal}>Cancelar</button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TabelaNoticiasPage;
