import React, { useEffect, useState, useMemo, useCallback } from 'react';
import SidebarNavigation from '../components/sidebar-navigation';

// Interface para morador - ajustada para corresponder exatamente à view
interface Morador {
    id: number;
    nome: string;
    cpf: string;
    telefone: string;
    email?: string;
    id_apartamento: number;
    id_entidade: number;
    // Campos retornados pela view vw_moradores_completo
    numeroApartamento: string;
    andar: number;
    id_bloco: number;
    nomeBloco: string;
    nomeEntidade: string;
    tipoEntidade: string;
}

type TipoModal = 'criar' | 'editar' | 'excluir' | 'visualizar' | null;

// Interface para parâmetros de consulta da API
interface ParametrosConsulta {
    pagina: number;
    itensPorPagina: number;
    termoPesquisa: string;
    campoOrdenacao?: string;
    direcaoOrdenacao?: 'asc' | 'desc';
    filtroBloco?: string;
    filtroEntidade?: string;
}

// Interface para resposta paginada da API
interface RespostaPaginada<T> {
    dados: T[];
    totalItens: number;
    totalPaginas: number;
    paginaAtual: number;
    itensPorPagina: number;
}

// Interface para opções dos selects
interface OpcoesBlocos {
    id: number;
    nome: string;
}

interface OpcoesApartamentos {
    id: number;
    numero: string;
    andar: number;
    id_bloco: number;
}

interface OpcoesEntidades {
    id: number;
    nome: string;
    tipo?: string;
}

interface TabelaMoradoresPageProps {}

const TabelaMoradoresPage: React.FC<TabelaMoradoresPageProps> = () => {
    const [moradores, setMoradores] = useState<Morador[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [tipoModal, setTipoModal] = useState<TipoModal>(null);
    const [moradorSelecionado, setMoradorSelecionado] = useState<Morador | null>(null);
    const [sidebarAberta, setSidebarAberta] = useState<boolean>(false);
    
    // Estados para opções dos selects
    const [blocosDisponiveis, setBlocosDisponiveis] = useState<OpcoesBlocos[]>([]);
    const [apartamentosDisponiveis, setApartamentosDisponiveis] = useState<OpcoesApartamentos[]>([]);
    const [entidadesDisponiveis, setEntidadesDisponiveis] = useState<OpcoesEntidades[]>([]);
    
    // Estado para controle do formulário do modal
    const [blocoSelecionadoForm, setBlocoSelecionadoForm] = useState<string>('');
    
    // Estados para controle de consulta
    const [parametrosConsulta, setParametrosConsulta] = useState<ParametrosConsulta>({
        pagina: 1,
        itensPorPagina: 8,
        termoPesquisa: '',
        campoOrdenacao: 'nome',
        direcaoOrdenacao: 'asc',
        filtroBloco: '',
        filtroEntidade: ''
    });
    
    // Estado para debounce da pesquisa
    const [termoPesquisaInput, setTermoPesquisaInput] = useState<string>('');
    const [erro, setErro] = useState<string>('');

    const toggleSidebar = (): void => setSidebarAberta((prev) => !prev);
    
    const abrirModalCriar = (): void => {
        setTipoModal('criar');
        setMoradorSelecionado(null);
        setBlocoSelecionadoForm(''); // Limpar seleção do bloco
    };

    const abrirModalEditar = (morador: Morador): void => {
        const apartamentoDoMorador = apartamentosDisponiveis.find(ap => ap.id === morador.id_apartamento);
        setBlocoSelecionadoForm(apartamentoDoMorador ? String(apartamentoDoMorador.id_bloco) : '');
        setTipoModal('editar');
        setMoradorSelecionado(morador);
    };

    const abrirModalExcluir = (morador: Morador): void => {
        setTipoModal('excluir');
        setMoradorSelecionado(morador);
    };

    const abrirModalVisualizar = (morador: Morador): void => {
        setTipoModal('visualizar');
        setMoradorSelecionado(morador);
    };

    const fecharModal = (): void => {
        setTipoModal(null);
        setMoradorSelecionado(null);
        setBlocoSelecionadoForm(''); // Limpar seleção do bloco ao fechar
    };

    // Configuração da API
    const API_BASE_URL = 'http://localhost:3001/api';

    // ===== CHAMADAS PARA API =====
    
    // Buscar moradores usando a view
    const buscarMoradores = useCallback(async (params: ParametrosConsulta): Promise<RespostaPaginada<Morador>> => {
        setLoading(true);
        setErro('');
        
        try {
            const queryParams = new URLSearchParams({
                pagina: params.pagina.toString(),
                itensPorPagina: params.itensPorPagina.toString(),
                termoPesquisa: params.termoPesquisa,
                campoOrdenacao: params.campoOrdenacao || 'nome',
                direcaoOrdenacao: params.direcaoOrdenacao || 'asc',
                filtroBloco: params.filtroBloco || '',
                filtroEntidade: params.filtroEntidade || ''
            });

            const response = await fetch(`${API_BASE_URL}/moradores?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
            }

            const resultado: RespostaPaginada<Morador> = await response.json();
            setLoading(false);
            return resultado;
            
        } catch (error) {
            setLoading(false);
            const mensagemErro = error instanceof Error ? error.message : 'Erro desconhecido ao buscar moradores';
            setErro(mensagemErro);
            console.error('Erro ao buscar moradores:', error);
            return {
                dados: [],
                totalItens: 0,
                totalPaginas: 0,
                paginaAtual: params.pagina,
                itensPorPagina: params.itensPorPagina
            };
        }
    }, [API_BASE_URL]);

    // Buscar opções para os selects
    const carregarOpcoes = useCallback(async () => {
        try {
            // Buscar blocos
            const responseBlocos = await fetch(`${API_BASE_URL}/condominio/blocos`);
            if (responseBlocos.ok) {
                const blocos: OpcoesBlocos[] = await responseBlocos.json();
                setBlocosDisponiveis(blocos);
            }

            // Buscar apartamentos
            const responseApartamentos = await fetch(`${API_BASE_URL}/condominio/apartamentos`);
            if (responseApartamentos.ok) {
                const apartamentos: OpcoesApartamentos[] = await responseApartamentos.json();
                setApartamentosDisponiveis(apartamentos);
            }

            // Buscar entidades (se necessário)

        } catch (error) {
            console.error('Erro ao carregar opções:', error);
        }
    }, [API_BASE_URL]);
    
    // ===== CONTROLE DE PARÂMETROS =====
    
    const mudarPagina = useCallback((novaPagina: number) => {
        setParametrosConsulta(prev => ({ ...prev, pagina: novaPagina }));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setParametrosConsulta(prev => ({ ...prev, pagina: 1, termoPesquisa: termoPesquisaInput }));
        }, 500);
        return () => clearTimeout(timer);
    }, [termoPesquisaInput]);

    const mudarOrdenacao = useCallback((campo: string) => {
        setParametrosConsulta(prev => ({
            ...prev,
            pagina: 1,
            campoOrdenacao: campo,
            direcaoOrdenacao: prev.campoOrdenacao === campo && prev.direcaoOrdenacao === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    const mudarFiltroBloco = useCallback((blocoId: string) => {
        setParametrosConsulta(prev => ({ ...prev, pagina: 1, filtroBloco: blocoId }));
    }, []);

    const mudarFiltroEntidade = useCallback((entidadeId: string) => {
        setParametrosConsulta(prev => ({ ...prev, pagina: 1, filtroEntidade: entidadeId }));
    }, []);
    
    // ===== RESULTADO DA CONSULTA =====
    const [resultadoConsulta, setResultadoConsulta] = useState<RespostaPaginada<Morador>>({
        dados: [], totalItens: 0, totalPaginas: 0, paginaAtual: 1, itensPorPagina: 8
    });

    useEffect(() => {
        carregarOpcoes();
    }, [carregarOpcoes]);

    useEffect(() => {
        buscarMoradores(parametrosConsulta).then(resultado => {
            setResultadoConsulta(resultado);
            setMoradores(resultado.dados);
        });
    }, [parametrosConsulta, buscarMoradores]);
    
    // ===== FUNÇÕES DE NAVEGAÇÃO =====
    const irParaPagina = useCallback((pagina: number) => {
        if (pagina >= 1 && pagina <= resultadoConsulta.totalPaginas) {
            mudarPagina(pagina);
        }
    }, [resultadoConsulta.totalPaginas, mudarPagina]);

    const paginaAnterior = useCallback(() => irParaPagina(resultadoConsulta.paginaAtual - 1), [irParaPagina, resultadoConsulta.paginaAtual]);
    const proximaPagina = useCallback(() => irParaPagina(resultadoConsulta.paginaAtual + 1), [irParaPagina, resultadoConsulta.paginaAtual]);
    
    const obterPaginasVisiveis = useCallback((): number[] => {
        const { totalPaginas, paginaAtual } = resultadoConsulta;
        const maxPaginasVisiveis = 5;
        if (totalPaginas <= maxPaginasVisiveis) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
        let inicio = Math.max(paginaAtual - 2, 1);
        let fim = Math.min(inicio + maxPaginasVisiveis - 1, totalPaginas);
        if (fim - inicio < maxPaginasVisiveis - 1) inicio = Math.max(fim - maxPaginasVisiveis + 1, 1);
        return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
    }, [resultadoConsulta]);

    // Filtra apartamentos para o formulário com base no bloco selecionado
    const apartamentosFiltrados = useMemo(() => {
        if (!blocoSelecionadoForm) return [];
        return apartamentosDisponiveis.filter(ap => String(ap.id_bloco) === blocoSelecionadoForm);
    }, [blocoSelecionadoForm, apartamentosDisponiveis]);

    // ===== OPERAÇÕES CRUD =====
    type DadosCriacaoMorador = {
        nome: string; email?: string; cpf: string; telefone: string; id_apartamento: number; id_entidade: number;
    };

    const criarMorador = async (dadosMorador: DadosCriacaoMorador): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/moradores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosMorador)
            });
            if (!response.ok) throw new Error(`Erro ao criar morador: ${response.status} - ${await response.text()}`);
            const resultado = await buscarMoradores(parametrosConsulta);
            setResultadoConsulta(resultado);
            setMoradores(resultado.dados);
        } catch (error) {
            console.error('Erro ao criar morador:', error);
            setErro(error instanceof Error ? error.message : 'Erro ao criar morador');
            throw error;
        }
    };

    const editarMorador = async (id: number, dadosMorador: Partial<DadosCriacaoMorador>): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/moradores/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosMorador)
            });
            if (!response.ok) throw new Error(`Erro ao editar morador: ${response.status} - ${await response.text()}`);
            const resultado = await buscarMoradores(parametrosConsulta);
            setResultadoConsulta(resultado);
            setMoradores(resultado.dados);
        } catch (error) {
            console.error('Erro ao editar morador:', error);
            setErro(error instanceof Error ? error.message : 'Erro ao editar morador');
            throw error;
        }
    };

    const excluirMorador = async (id: number): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/moradores/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Erro ao excluir morador: ${response.status} - ${await response.text()}`);
            const resultado = await buscarMoradores(parametrosConsulta);
            setResultadoConsulta(resultado);
            setMoradores(resultado.dados);
        } catch (error) {
            console.error('Erro ao excluir morador:', error);
            setErro(error instanceof Error ? error.message : 'Erro ao excluir morador');
            throw error;
        }
    };
    
    const handleSalvarMorador = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const dadosMorador: DadosCriacaoMorador = {
            nome: formData.get('nome') as string,
            email: formData.get('email') as string || undefined,
            cpf: formData.get('cpf') as string,
            telefone: formData.get('telefone') as string,
            id_apartamento: parseInt(formData.get('id_apartamento') as string),
            id_entidade: parseInt(formData.get('id_entidade') as string),
        };

        try {
            if (tipoModal === 'criar') await criarMorador(dadosMorador);
            else if (tipoModal === 'editar' && moradorSelecionado) await editarMorador(moradorSelecionado.id, dadosMorador);
            fecharModal();
        } catch (error) { /* Erro já tratado nas funções CRUD */ }
    };
    
    const handleExcluir = async (): Promise<void> => {
        if (moradorSelecionado) {
            try {
                await excluirMorador(moradorSelecionado.id);
                fecharModal();
            } catch (error) { /* Erro já tratado na função */ }
        }
    };
    
    return (
        <div className='pagina-tabelaUsuarios'>
            {/********************* Sidebar *******************/}
            <SidebarNavigation sidebarAberta={sidebarAberta} toggleSidebar={toggleSidebar} currentPage="/tabelaMoradores" />

            {/********************* Conteúdo Principal *******************/}
            <div className='background-tabelaUsuarios'>
                <div className='titulo-tabelaUsuarios'><h1>Tabela de Moradores</h1></div>
                <div className='conteudo-tabelaUsuarios'>
                    {erro && <div className="mensagem-erro">{erro}</div>}
                    
                    {/* Pesquisa, filtros e botão de criar */}
                    <div className="pesquisa-tabelaUsuarios">
                        <input type="text" placeholder="Pesquisar por nome, CPF, etc..." value={termoPesquisaInput} onChange={(e) => setTermoPesquisaInput(e.target.value)} />
                        <select value={parametrosConsulta.filtroBloco} onChange={(e) => mudarFiltroBloco(e.target.value)}>
                            <option value="">Todos os Blocos</option>
                            {blocosDisponiveis.map(bloco => <option key={bloco.id} value={bloco.id.toString()}>Bloco {bloco.nome}</option>)}
                        </select>
                        <button onClick={abrirModalCriar}>Adicionar Morador</button>
                    </div>

                    {/* Estatísticas */}
                    <div className="estatisticas-tabela">
                        <span>Total de moradores: {resultadoConsulta.totalItens}</span>
                    </div>

                    {/********************* Tabela *******************/}
                    <table className='tabela-usuarios'>
                        <thead>
                            <tr>
                                <th onClick={() => mudarOrdenacao('id')} style={{ cursor: 'pointer' }}>ID {parametrosConsulta.campoOrdenacao === 'id' && (parametrosConsulta.direcaoOrdenacao === 'asc' ? '↑' : '↓')}</th>
                                <th onClick={() => mudarOrdenacao('nome')} style={{ cursor: 'pointer' }}>Nome {parametrosConsulta.campoOrdenacao === 'nome' && (parametrosConsulta.direcaoOrdenacao === 'asc' ? '↑' : '↓')}</th>
                                <th onClick={() => mudarOrdenacao('cpf')} style={{ cursor: 'pointer' }}>CPF {parametrosConsulta.campoOrdenacao === 'cpf' && (parametrosConsulta.direcaoOrdenacao === 'asc' ? '↑' : '↓')}</th>
                                <th onClick={() => mudarOrdenacao('telefone')} style={{ cursor: 'pointer' }}>Telefone {parametrosConsulta.campoOrdenacao === 'telefone' && (parametrosConsulta.direcaoOrdenacao === 'asc' ? '↑' : '↓')}</th>
                                <th onClick={() => mudarOrdenacao('nomeBloco')} style={{ cursor: 'pointer' }}>Bloco {parametrosConsulta.campoOrdenacao === 'nomeBloco' && (parametrosConsulta.direcaoOrdenacao === 'asc' ? '↑' : '↓')}</th>
                                <th onClick={() => mudarOrdenacao('numeroApartamento')} style={{ cursor: 'pointer' }}>Apartamento {parametrosConsulta.campoOrdenacao === 'numeroApartamento' && (parametrosConsulta.direcaoOrdenacao === 'asc' ? '↑' : '↓')}</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center' }}>Carregando moradores...</td></tr>
                            ) : moradores.length === 0 ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center' }}>Nenhum morador encontrado.</td></tr>
                            ) : (
                                moradores.map((morador) => (
                                    <tr key={morador.id}>
                                        <td>{morador.id}</td>
                                        <td>{morador.nome}</td>
                                        <td>{morador.cpf}</td>
                                        <td>{morador.telefone}</td>
                                        <td style={{ textAlign: 'center' }}>{morador.nomeBloco}</td>
                                        <td style={{ textAlign: 'center' }}>{morador.numeroApartamento}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button onClick={() => abrirModalVisualizar(morador)}>Visualizar</button>
                                                <button onClick={() => abrirModalEditar(morador)}>Editar</button>
                                                <button onClick={() => abrirModalExcluir(morador)}>Excluir</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/********************* Paginação *******************/}
                    {resultadoConsulta.totalPaginas > 1 && (
                        <div className="paginacao-tabelaUsuarios">
                            <button onClick={paginaAnterior} disabled={resultadoConsulta.paginaAtual === 1}>{'⮜'}</button>
                            {obterPaginasVisiveis().map((numeroPagina) => (
                                <button key={numeroPagina} onClick={() => irParaPagina(numeroPagina)} className={resultadoConsulta.paginaAtual === numeroPagina ? 'ativo' : ''}>
                                    {numeroPagina}
                                </button>
                            ))}
                            <button onClick={proximaPagina} disabled={resultadoConsulta.paginaAtual === resultadoConsulta.totalPaginas}>{'⮞'}</button>
                        </div>
                    )}
                </div>
            </div>

            {/********************* Modal de Criar/Editar *******************/}
            {(tipoModal === 'criar' || tipoModal === 'editar') && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-conteudo" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <h2>{tipoModal === 'criar' ? 'Adicionar Morador' : 'Editar Morador'}</h2>
                        <form onSubmit={handleSalvarMorador}>
                            <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label>Nome *</label>
                                    <input type="text" name="nome" required defaultValue={moradorSelecionado?.nome || ''} />
                                </div>
                                <div>
                                    <label>Email</label>
                                    <input type="email" name="email" defaultValue={moradorSelecionado?.email || ''} />
                                </div>
                                <div>
                                    <label>CPF *</label>
                                    <input type="text" name="cpf" required defaultValue={moradorSelecionado?.cpf || ''} />
                                </div>
                                <div>
                                    <label>Telefone *</label>
                                    <input type="text" name="telefone" required defaultValue={moradorSelecionado?.telefone || ''} />
                                </div>
                                <div>
                                    <label>Bloco *</label>
                                    <select
                                        name="id_bloco"
                                        required
                                        value={blocoSelecionadoForm}
                                        onChange={(e) => setBlocoSelecionadoForm(e.target.value)}
                                    >
                                        <option value="">Selecione um bloco</option>
                                        {blocosDisponiveis.map(bloco => (
                                            <option key={bloco.id} value={bloco.id}>{bloco.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Apartamento *</label>
                                    <select
                                        name="id_apartamento"
                                        required
                                        defaultValue={moradorSelecionado?.id_apartamento || ''}
                                        disabled={!blocoSelecionadoForm} // Desabilitado até um bloco ser escolhido
                                    >
                                        <option value="">Selecione um apartamento</option>
                                        {apartamentosFiltrados.map(ap => (
                                            <option key={ap.id} value={ap.id}>
                                                {ap.numero} - Andar {ap.andar}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={fecharModal}>Cancelar</button>
                                <button type="submit">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/********************* Modal de Excluir *******************/}
            {tipoModal === 'excluir' && moradorSelecionado && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-conteudo" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <h2>Excluir Morador</h2>
                        <p>Tem certeza que deseja excluir o morador <strong>{moradorSelecionado.nome}</strong>?</p>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button type="button" onClick={fecharModal}>Cancelar</button>
                            <button type="button" onClick={handleExcluir} className="botao-excluir">Excluir</button>
                        </div>
                    </div>
                </div>
            )}

            {/********************* Modal de Visualizar *******************/}
            {tipoModal === 'visualizar' && moradorSelecionado && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-conteudo" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <h2>Detalhes do Morador</h2>
                        <p><strong>Nome:</strong> {moradorSelecionado.nome}</p>
                        <p><strong>CPF:</strong> {moradorSelecionado.cpf}</p>
                        <p><strong>Telefone:</strong> {moradorSelecionado.telefone}</p>
                        <p><strong>Email:</strong> {moradorSelecionado.email || 'Não informado'}</p>
                        <p><strong>Bloco:</strong> {moradorSelecionado.nomeBloco}</p>
                        <p><strong>Apartamento:</strong> {moradorSelecionado.numeroApartamento} - Andar {moradorSelecionado.andar}º</p>
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <button type="button" onClick={fecharModal}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TabelaMoradoresPage;