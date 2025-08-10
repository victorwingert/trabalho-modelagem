import React, { useEffect, useState, useMemo, useCallback } from 'react';
//import { Link } from 'react-router-dom';
import SidebarNavigation from '../components/sidebar-navigation';

interface Usuario {
    id: number;
    nome: string;
    bloco: string;
    apartamento: string;
    email?: string;
}

type TipoModal = 'criar' | 'editar' | 'excluir' | 'visualizar' | null;

// Interface para parâmetros de consulta (futura integração com API)
interface ParametrosConsulta {
    pagina: number;
    itensPorPagina: number;
    termoPesquisa: string;
    campoOrdenacao?: string;
    direcaoOrdenacao?: 'asc' | 'desc';
}

// Interface para resposta paginada (futura integração com API)
interface RespostaPaginada<T> {
    dados: T[];
    totalItens: number;
    totalPaginas: number;
    paginaAtual: number;
    itensPorPagina: number;
}

interface TabelaUsuariosPageProps {}

const TabelaUsuariosPage: React.FC<TabelaUsuariosPageProps> = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [tipoModal, setTipoModal] = useState<TipoModal>(null);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
    const [sidebarAberta, setSidebarAberta] = useState<boolean>(false);
    
    // Estados para controle de consulta
    const [parametrosConsulta, setParametrosConsulta] = useState<ParametrosConsulta>({
        pagina: 1,
        itensPorPagina: 5,
        termoPesquisa: '',
        campoOrdenacao: 'nome',
        direcaoOrdenacao: 'asc'
    });

    // Estado para debounce da pesquisa
    const [termoPesquisaInput, setTermoPesquisaInput] = useState<string>('');

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

    // ===== SIMULAÇÃO DE API =====
    // Esta função simula uma chamada para API/banco de dados
    const buscarUsuarios = useCallback(async (params: ParametrosConsulta): Promise<RespostaPaginada<Usuario>> => {
        setLoading(true);
        
        // Simulando delay de rede
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Dados mock - em produção, isso viria do seu banco de dados
        const todosDados: Usuario[] = [
            { id: 0, nome: 'maria', bloco: 'A', apartamento: '102', email: 'maria@email.com' },
            { id: 1, nome: 'seven9', bloco: 'A', apartamento: '101', email: 'seven9@email.com' },
            { id: 2, nome: '7nine', bloco: 'B', apartamento: '202', email: '7nine@email.com' },
            { id: 3, nome: 'sevenin', bloco: 'B', apartamento: '203', email: 'sevenin@email.com' },
            { id: 4, nome: 'pedro', bloco: 'C', apartamento: '301', email: 'pedro@email.com' },
            { id: 5, nome: 'caetano', bloco: 'C', apartamento: '302', email: 'caetano@email.com' },
            { id: 6, nome: 'maria', bloco: 'A', apartamento: '102', email: 'maria@email.com' },
            { id: 7, nome: 'joão', bloco: 'B', apartamento: '204', email: 'joao@email.com' },
            { id: 8, nome: 'ana', bloco: 'A', apartamento: '103', email: 'ana@email.com' },
            { id: 9, nome: 'carlos', bloco: 'C', apartamento: '303', email: 'carlos@email.com' },
            { id: 10, nome: 'lucia', bloco: 'B', apartamento: '205', email: 'lucia@email.com' },
            { id: 11, nome: 'roberto', bloco: 'A', apartamento: '104', email: 'roberto@email.com' },
            { id: 12, nome: 'fernanda', bloco: 'C', apartamento: '304', email: 'fernanda@email.com' },
            { id: 13, nome: 'maria aparecida', bloco: 'A', apartamento: '102', email: 'maria@email.com' },
            { id: 14, nome: 'maria ana', bloco: 'A', apartamento: '102', email: 'maria@email.com' },
            { id: 15, nome: 'mariazinha', bloco: 'A', apartamento: '102', email: 'maria@email.com' },
            { id: 16, nome: 'mariana', bloco: 'A', apartamento: '102', email: 'maria@email.com' },
        ];

        // ===== LÓGICA DE PESQUISA =====
        let dadosFiltrados = todosDados;
        if (params.termoPesquisa.trim()) {
            const termo = params.termoPesquisa.toLowerCase().trim();
            dadosFiltrados = todosDados.filter(usuario => {
                return (
                    usuario.nome.toLowerCase().includes(termo) ||
                    usuario.bloco.toLowerCase().includes(termo) ||
                    usuario.apartamento.toLowerCase().includes(termo) ||
                    usuario.email?.toLowerCase().includes(termo) ||
                    usuario.id.toString().includes(termo)
                );
            });
        }

        // ===== LÓGICA DE ORDENAÇÃO =====
        dadosFiltrados.sort((a, b) => {
            const campoA = a[params.campoOrdenacao as keyof Usuario]?.toString().toLowerCase() || '';
            const campoB = b[params.campoOrdenacao as keyof Usuario]?.toString().toLowerCase() || '';
            
            if (params.direcaoOrdenacao === 'desc') {
                return campoB.localeCompare(campoA);
            }
            return campoA.localeCompare(campoB);
        });

        // ===== LÓGICA DE PAGINAÇÃO =====
        const totalItens = dadosFiltrados.length;
        const totalPaginas = Math.ceil(totalItens / params.itensPorPagina);
        const indiceInicial = (params.pagina - 1) * params.itensPorPagina;
        const indiceFinal = indiceInicial + params.itensPorPagina;
        const dadosPagina = dadosFiltrados.slice(indiceInicial, indiceFinal);

        setLoading(false);

        return {
            dados: dadosPagina,
            totalItens,
            totalPaginas,
            paginaAtual: params.pagina,
            itensPorPagina: params.itensPorPagina
        };
    }, []);

    // ===== CONTROLE DE PARÂMETROS =====
    
    // Atualizar página
    const mudarPagina = useCallback((novaPagina: number) => {
        setParametrosConsulta(prev => ({
            ...prev,
            pagina: novaPagina
        }));
    }, []);

    // Atualizar pesquisa com debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setParametrosConsulta(prev => ({
                ...prev,
                pagina: 1, // Resetar para primeira página ao pesquisar
                termoPesquisa: termoPesquisaInput
            }));
        }, 500); // 500ms de delay para debounce

        return () => clearTimeout(timer);
    }, [termoPesquisaInput]);

    // Atualizar ordenação
    const mudarOrdenacao = useCallback((campo: string) => {
        setParametrosConsulta(prev => ({
            ...prev,
            pagina: 1,
            campoOrdenacao: campo,
            direcaoOrdenacao: prev.campoOrdenacao === campo && prev.direcaoOrdenacao === 'asc' 
                ? 'desc' 
                : 'asc'
        }));
    }, []);

    // ===== RESULTADO DA CONSULTA =====
    const [resultadoConsulta, setResultadoConsulta] = useState<RespostaPaginada<Usuario>>({
        dados: [],
        totalItens: 0,
        totalPaginas: 0,
        paginaAtual: 1,
        itensPorPagina: 3
    });

    // Executar consulta quando parâmetros mudarem
    useEffect(() => {
        buscarUsuarios(parametrosConsulta).then(resultado => {
            setResultadoConsulta(resultado);
            setUsuarios(resultado.dados);
        });
    }, [parametrosConsulta, buscarUsuarios]);

    // ===== FUNÇÕES DE NAVEGAÇÃO =====
    const irParaPagina = useCallback((pagina: number) => {
        if (pagina >= 1 && pagina <= resultadoConsulta.totalPaginas) {
            mudarPagina(pagina);
        }
    }, [resultadoConsulta.totalPaginas, mudarPagina]);

    const paginaAnterior = useCallback(() => {
        irParaPagina(resultadoConsulta.paginaAtual - 1);
    }, [irParaPagina, resultadoConsulta.paginaAtual]);

    const proximaPagina = useCallback(() => {
        irParaPagina(resultadoConsulta.paginaAtual + 1);
    }, [irParaPagina, resultadoConsulta.paginaAtual]);

    // Gerar números das páginas visíveis (máximo 3)
    const obterPaginasVisiveis = useCallback((): number[] => {
        const { totalPaginas, paginaAtual } = resultadoConsulta;
        const maxPaginasVisiveis = 3;
        
        if (totalPaginas <= maxPaginasVisiveis) {
            return Array.from({ length: totalPaginas }, (_, i) => i + 1);
        }

        let inicio = Math.max(paginaAtual - 1, 1);
        let fim = Math.min(inicio + maxPaginasVisiveis - 1, totalPaginas);

        // Ajustar se chegou no final
        if (fim - inicio < maxPaginasVisiveis - 1) {
            inicio = Math.max(fim - maxPaginasVisiveis + 1, 1);
        }

        return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
    }, [resultadoConsulta]);

    // ===== OPERAÇÕES CRUD =====
    
    const criarUsuario = async (dadosUsuario: Omit<Usuario, 'id'>): Promise<void> => {
        // Simular chamada para API
        const novoUsuario: Usuario = {
            ...dadosUsuario,
            id: Date.now()
        };
        
        // Em produção: await api.post('/usuarios', dadosUsuario)
        console.log('Criando usuário:', novoUsuario);
        
        // Recarregar dados
        const resultado = await buscarUsuarios(parametrosConsulta);
        setResultadoConsulta(resultado);
        setUsuarios(resultado.dados);
    };

    const editarUsuario = async (id: number, dadosUsuario: Partial<Usuario>): Promise<void> => {
        // Em produção: await api.put(`/usuarios/${id}`, dadosUsuario)
        console.log('Editando usuário:', id, dadosUsuario);
        
        // Recarregar dados
        const resultado = await buscarUsuarios(parametrosConsulta);
        setResultadoConsulta(resultado);
        setUsuarios(resultado.dados);
    };

    const excluirUsuario = async (id: number): Promise<void> => {
        // Em produção: await api.delete(`/usuarios/${id}`)
        console.log('Excluindo usuário:', id);
        
        // Recarregar dados
        const resultado = await buscarUsuarios(parametrosConsulta);
        setResultadoConsulta(resultado);
        setUsuarios(resultado.dados);
    };

    const handleSalvarUsuario = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const dadosUsuario = {
            nome: formData.get('nome') as string,
            email: formData.get('email') as string,
            bloco: formData.get('bloco') as string,
            apartamento: formData.get('apartamento') as string,
        };

        try {
            if (tipoModal === 'criar') {
                await criarUsuario(dadosUsuario);
            } else if (tipoModal === 'editar' && usuarioSelecionado) {
                await editarUsuario(usuarioSelecionado.id, dadosUsuario);
            }
            fecharModal();
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            // Em produção: mostrar toast de erro
        }
    };

    return (
        <div className='pagina-tabelaUsuarios'>
            {/********************* Sidebar *******************/}
            <SidebarNavigation 
                sidebarAberta={sidebarAberta}
                toggleSidebar={toggleSidebar}
                currentPage="/tabelaUsuarios"
            />

            {/********************* titulo *******************/}
            <div className='background-tabelaUsuarios'>
                <div className='titulo-tabelaUsuarios'>
                    <h1>Tabela de Usuários</h1>
                </div>

                <div className='conteudo-tabelaUsuarios'>
                    {/********************* pesquisa e criar *******************/}
                    <div className="pesquisa-tabelaUsuarios">
                        <input 
                            type="text" 
                            placeholder="Pesquisar por nome, email, bloco ou apartamento..." 
                            value={termoPesquisaInput}
                            onChange={(e) => setTermoPesquisaInput(e.target.value)}
                        />
                        <button onClick={abrirModalCriar}>Criar</button>
                    </div>

                    {/********************* tabela *******************/}
                    <table className='tabela-usuarios'>
                        <thead>
                            <tr>
                                <th 
                                    onClick={() => mudarOrdenacao('id')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    ID {parametrosConsulta.campoOrdenacao === 'id' && (
                                        parametrosConsulta.direcaoOrdenacao === 'asc' ? '↑' : '↓'
                                    )}
                                </th>
                                <th 
                                    onClick={() => mudarOrdenacao('nome')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Nome {parametrosConsulta.campoOrdenacao === 'nome' && (
                                        parametrosConsulta.direcaoOrdenacao === 'asc' ? '↑' : '↓'
                                    )}
                                </th>
                                <th 
                                    onClick={() => mudarOrdenacao('bloco')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Bloco {parametrosConsulta.campoOrdenacao === 'bloco' && (
                                        parametrosConsulta.direcaoOrdenacao === 'asc' ? '↑' : '↓'
                                    )}
                                </th>
                                <th 
                                    onClick={() => mudarOrdenacao('apartamento')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Apartamento {parametrosConsulta.campoOrdenacao === 'apartamento' && (
                                        parametrosConsulta.direcaoOrdenacao === 'asc' ? '↑' : '↓'
                                    )}
                                </th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center' }}>
                                        Carregando...
                                    </td>
                                </tr>
                            ) : usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center' }}>
                                        {parametrosConsulta.termoPesquisa ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((usuario) => (
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
                                ))
                            )}
                        </tbody>
                    </table>

                    {/********************* paginacao *******************/}
                    {resultadoConsulta.totalPaginas > 1 && (
                        <div className="paginacao-tabelaUsuarios">
                            {/* Botão página anterior */}
                            <button 
                                onClick={paginaAnterior}
                                disabled={resultadoConsulta.paginaAtual === 1}
                                style={{ 
                                    opacity: resultadoConsulta.paginaAtual === 1 ? 0.5 : 1,
                                    cursor: resultadoConsulta.paginaAtual === 1 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {'⮜'}
                            </button>

                            {/* Números das páginas */}
                            {obterPaginasVisiveis().map((numeroPagina) => (
                                <button
                                    key={numeroPagina}
                                    onClick={() => irParaPagina(numeroPagina)}
                                    className={resultadoConsulta.paginaAtual === numeroPagina ? 'ativo' : ''}
                                >
                                    {numeroPagina}
                                </button>
                            ))}

                            {/* Botão próxima página */}
                            <button 
                                onClick={proximaPagina}
                                disabled={resultadoConsulta.paginaAtual === resultadoConsulta.totalPaginas}
                                style={{ 
                                    opacity: resultadoConsulta.paginaAtual === resultadoConsulta.totalPaginas ? 0.5 : 1,
                                    cursor: resultadoConsulta.paginaAtual === resultadoConsulta.totalPaginas ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {'⮞'}
                            </button>
                        </div>
                    )}
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
                                        onClick={async () => {
                                            if (usuarioSelecionado) {
                                                await excluirUsuario(usuarioSelecionado.id);
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
                                <p><strong>Email:</strong> {usuarioSelecionado?.email}</p>
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
                                <form onSubmit={handleSalvarUsuario}>
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
                                        <input 
                                            name="email" 
                                            type="email" 
                                            defaultValue={usuarioSelecionado?.email || ''}
                                            required 
                                        />
                                    </label>
                                    <label>
                                        Bloco:
                                        <input 
                                            name="bloco" 
                                            defaultValue={usuarioSelecionado?.bloco || ''}
                                            required 
                                        />
                                    </label>
                                    <label>
                                        Apartamento:
                                        <input 
                                            name="apartamento" 
                                            defaultValue={usuarioSelecionado?.apartamento || ''}
                                            required 
                                        />
                                    </label>
                                    <br />
                                    <div className='modal-botoes'>
                                        <button type="submit" disabled={loading}>
                                            {loading ? 'Salvando...' : 'Salvar'}
                                        </button>
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