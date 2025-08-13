
import React, { useEffect, useState, useCallback } from 'react';
import SidebarNavigation from '../components/sidebar-navigation';

// Interface atualizada para corresponder ao backend
interface Noticia {
    id: number;
    titulo: string;
    descricao: string;
    data_publicacao: string;
}

// Interface para a resposta paginada da API
interface RespostaPaginada<T> {
    dados: T[];
    totalItens: number;
    totalPaginas: number;
    paginaAtual: number;
}

type TipoModal = 'criar' | 'editar' | 'excluir' | 'visualizar' | null;

const TabelaNoticiasPage: React.FC = () => {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    // Controle de modais
    const [tipoModal, setTipoModal] = useState<TipoModal>(null);
    const [noticiaSelecionada, setNoticiaSelecionada] = useState<Noticia | null>(null);
    const [sidebarAberta, setSidebarAberta] = useState<boolean>(false);
    
    // Controle de paginação e pesquisa
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [termoPesquisaDebounced, setTermoPesquisaDebounced] = useState('');

    const API_BASE_URL = "http://localhost:3001/api"; // Altere se o seu endereço for diferente

    const toggleSidebar = (): void => setSidebarAberta((prev) => !prev);

    // Funções para abrir os modais
    const abrirModalCriar = () => { setTipoModal('criar'); setNoticiaSelecionada(null); };
    const abrirModalEditar = (noticia: Noticia) => { setTipoModal('editar'); setNoticiaSelecionada(noticia); };
    const abrirModalExcluir = (noticia: Noticia) => { setTipoModal('excluir'); setNoticiaSelecionada(noticia); };
    const abrirModalVisualizar = (noticia: Noticia) => { setTipoModal('visualizar'); setNoticiaSelecionada(noticia); };
    const fecharModal = () => { setTipoModal(null); setNoticiaSelecionada(null); };

    // Função para buscar dados da API
    const buscarNoticias = useCallback(async () => {
        setLoading(true);
        setErro(null);
        try {
            const params = new URLSearchParams({
                pagina: paginaAtual.toString(),
                itensPorPagina: '8',
                termoPesquisa: termoPesquisaDebounced,
                campoOrdenacao: 'data_publicacao',
                direcaoOrdenacao: 'desc'
            });

            const response = await fetch(`${API_BASE_URL}/noticias?${params}`);
            if (!response.ok) throw new Error('Falha ao buscar dados das notícias.');
            
            const data: RespostaPaginada<Noticia> = await response.json();
            
            // Formatar a data para o formato yyyy-mm-dd
            const noticiasFormatadas = data.dados.map(n => ({
                ...n,
                data_publicacao: n.data_publicacao.split('T')[0]
            }));

            setNoticias(noticiasFormatadas);
            setTotalPaginas(data.totalPaginas);

        } catch (error: any) {
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    }, [paginaAtual, termoPesquisaDebounced]);

    // Efeito para aplicar debounce na pesquisa
    useEffect(() => {
        const handler = setTimeout(() => {
            setTermoPesquisaDebounced(termoPesquisa);
            setPaginaAtual(1); // Resetar para a primeira página ao pesquisar
        }, 500);
        return () => clearTimeout(handler);
    }, [termoPesquisa]);
    
    // Efeito para buscar notícias quando a página ou a pesquisa mudar
    useEffect(() => {
        buscarNoticias();
    }, [buscarNoticias]);

    // Função para salvar (criar ou editar)
    const handleSalvarNoticia = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const dadosNoticia = {
            titulo: formData.get('titulo') as string,
            descricao: formData.get('descricao') as string,
            data_publicacao: formData.get('data_publicacao') as string,
        };

        const isCreating = tipoModal === 'criar';
        const url = isCreating ? `${API_BASE_URL}/noticias` : `${API_BASE_URL}/noticias/${noticiaSelecionada?.id}`;
        const method = isCreating ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosNoticia)
            });
            if (!response.ok) throw new Error(`Falha ao ${isCreating ? 'criar' : 'editar'} notícia.`);
            
            fecharModal();
            buscarNoticias(); // Recarrega a lista
        } catch (error: any) {
            setErro(error.message);
        }
    };

    // Função para excluir
    const handleExcluir = async () => {
        if (!noticiaSelecionada) return;
        try {
            const response = await fetch(`${API_BASE_URL}/noticias/${noticiaSelecionada.id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Falha ao excluir notícia.');
            
            fecharModal();
            buscarNoticias(); // Recarrega a lista
        } catch (error: any) {
            setErro(error.message);
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

            {/********************* Conteúdo Principal *******************/}
            <div className='background-tabelaUsuarios'>
                <div className='titulo-tabelaUsuarios'>
                    <h1>Tabela de Notícias</h1>
                </div>

                <div className='conteudo-tabelaUsuarios'>
                    {/********************* Erro *******************/}
                    {erro && <div className="alert-error">{erro}</div>}

                    {/********************* Pesquisa e Criar *******************/}
                    <div className="pesquisa-tabelaUsuarios">
                        <input 
                            type="text" 
                            placeholder="Pesquisar por título ou descrição..." 
                            value={termoPesquisa}
                            onChange={(e) => setTermoPesquisa(e.target.value)}
                        />
                        <button onClick={abrirModalCriar}>Adicionar Notícia</button>
                    </div>

                    {/********************* Tabela *******************/}
                    <table className="tabela-usuarios">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Descrição</th>
                                <th>Data de Publicação</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4}>Carregando...</td></tr>
                            ) : noticias.length === 0 ? (
                                <tr><td colSpan={4}>Nenhuma notícia encontrada.</td></tr>
                            ) : (
                                noticias.map((noticia) => (
                                    <tr key={noticia.id}>
                                        <td>{noticia.titulo}</td>
                                        <td>{noticia.descricao.substring(0, 50)}{noticia.descricao.length > 50 ? '...' : ''}</td>
                                        <td>{new Date(noticia.data_publicacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                        <td>
                                            <button onClick={() => abrirModalVisualizar(noticia)}>Visualizar</button>
                                            <button onClick={() => abrirModalEditar(noticia)}>Editar</button>
                                            <button onClick={() => abrirModalExcluir(noticia)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/********************* Paginação *******************/}
                    {totalPaginas > 1 && (
                        <div className="paginacao-tabelaUsuarios">
                            <button onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))} disabled={paginaAtual === 1}>{'⮜'}</button>
                            <span>Página {paginaAtual} de {totalPaginas}</span>
                            <button onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))} disabled={paginaAtual === totalPaginas}>{'⮞'}</button>
                        </div>
                    )}
                </div>
            </div>

            {/********************* Modais *******************/}
            {tipoModal && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
                        {tipoModal === 'excluir' ? (
                            <>
                                <h2>Confirmar Exclusão</h2>
                                <p>Deseja excluir a notícia <strong>"{noticiaSelecionada?.titulo}"</strong>?</p>
                                <button onClick={handleExcluir}>Confirmar</button>
                                <button onClick={fecharModal}>Cancelar</button>
                            </>
                        ) : tipoModal === 'visualizar' ? (
                            <>
                                <h2>{noticiaSelecionada?.titulo}</h2>
                                <p><strong>Data de Publicação:</strong> {noticiaSelecionada?.data_publicacao ? new Date(noticiaSelecionada.data_publicacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''}</p>
                                <hr/>
                                <p>{noticiaSelecionada?.descricao}</p>
                                <button onClick={fecharModal}>Fechar</button>
                            </>
                        ) : ( // Criar ou Editar
                            <>
                                <h2>{tipoModal === 'criar' ? 'Criar Nova Notícia' : 'Editar Notícia'}</h2>
                                <form onSubmit={handleSalvarNoticia}>
                                    <label> Título:
                                        <input type="text" name="titulo" defaultValue={noticiaSelecionada?.titulo || ''} required />
                                    </label>
                                    <label> Descrição:
                                        <textarea name="descricao" defaultValue={noticiaSelecionada?.descricao || ''} required />
                                    </label>
                                    <label> Data de Publicação:
                                        <input type="date" name="data_publicacao" defaultValue={noticiaSelecionada?.data_publicacao || ''} required />
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