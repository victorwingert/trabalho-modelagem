import React, { useEffect, useState } from 'react';
import SidebarNavigation from '../components/sidebar-navigation';

interface Pedido {
    id: number;
    tipo_servico: string;
    descricao: string;
    data_solicitacao: string;
    data_conclusao?: string;
    status: string;
    morador_id: number;
    funcionario_id?: number;
    nome_morador?: string;
    apartamento?: string;
}

type TipoModal = 'criar' | 'editar' | 'excluir' | 'visualizar' | null;

// Configuração da URL base da API
const API_BASE_URL = 'http://localhost:3001/api'; // Ajuste conforme seu backend

const TabelaPedidosPage: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [tipoModal, setTipoModal] = useState<TipoModal>(null);
    const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
    const [sidebarAberta, setSidebarAberta] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const toggleSidebar = (): void => setSidebarAberta((prev) => !prev);

    // Função para buscar serviços da API
    const buscarPedidos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/servicos`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar serviços');
            }
            
            const pedidosData = await response.json();
            setPedidos(pedidosData);
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
            setError('Erro ao carregar serviços');
        } finally {
            setLoading(false);
        }
    };

    // Carregar pedidos ao montar o componente
    useEffect(() => {
        buscarPedidos();
    }, []);

    const abrirModalCriar = () => {
        setTipoModal('criar');
        setPedidoSelecionado(null);
    };

    const abrirModalEditar = (pedido: Pedido) => {
        setTipoModal('editar');
        setPedidoSelecionado(pedido);
    };

    const abrirModalExcluir = (pedido: Pedido) => {
        setTipoModal('excluir');
        setPedidoSelecionado(pedido);
    };

    const abrirModalVisualizar = (pedido: Pedido) => {
        setTipoModal('visualizar');
        setPedidoSelecionado(pedido);
    };

    const fecharModal = () => {
        setTipoModal(null);
        setPedidoSelecionado(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Concluído':
                return '#28a745';
            case 'Em andamento':
                return '#ffc107';
            case 'Pendente':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    const handleSalvarPedido = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const dadosPedido = {
            tipo_servico: formData.get('tipo_servico') as string,
            descricao: formData.get('descricao') as string,
            data_solicitacao: formData.get('data_solicitacao') as string,
            data_conclusao: formData.get('data_conclusao') as string || null,
            status: formData.get('status') as string,
            morador_id: parseInt(formData.get('morador_id') as string) || 1,
            funcionario_id: parseInt(formData.get('funcionario_id') as string) || null,
        };

        try {
            let response;
            
            if (tipoModal === 'criar') {
                // Criar novo serviço
                response = await fetch(`${API_BASE_URL}/servicos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosPedido),
                });
            } else {
                // Editar serviço existente
                response = await fetch(`${API_BASE_URL}/servicos/${pedidoSelecionado?.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosPedido),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao salvar serviço');
            }

            const result = await response.json();
            console.log(result.message); // Log da mensagem de sucesso

            // Recarregar a lista de serviços
            await buscarPedidos();
            fecharModal();
            
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
            setError(error instanceof Error ? error.message : 'Erro ao salvar serviço');
        }
    };

    const handleExcluir = async (id: number) => {
        if (!confirm('Deseja excluir este pedido?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/servicos/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao excluir serviço');
            }

            const result = await response.json();
            console.log(result.message); // Log da mensagem de sucesso

            // Recarregar a lista de serviços
            await buscarPedidos();
            fecharModal();
            
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            setError(error instanceof Error ? error.message : 'Erro ao excluir serviço');
        }
    };

    // Mostrar loading
    if (loading) {
        return (
            <div className="pagina-tabelaUsuarios">
                <SidebarNavigation 
                    sidebarAberta={sidebarAberta}
                    toggleSidebar={toggleSidebar}
                    currentPage="/tabelaPedidos"
                />
                <div className='background-tabelaUsuarios'>
                    <div className='titulo-tabelaUsuarios'>
                        <h1>Carregando serviços...</h1>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar erro
    if (error) {
        return (
            <div className="pagina-tabelaUsuarios">
                <SidebarNavigation 
                    sidebarAberta={sidebarAberta}
                    toggleSidebar={toggleSidebar}
                    currentPage="/tabelaPedidos"
                />
                <div className='background-tabelaUsuarios'>
                    <div className='titulo-tabelaUsuarios'>
                        <h1>Erro ao carregar serviços</h1>
                        <p>{error}</p>
                        <button onClick={buscarPedidos}>Tentar novamente</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pagina-tabelaUsuarios">
            {/********************* Sidebar *******************/}
            <SidebarNavigation 
                            sidebarAberta={sidebarAberta}
                            toggleSidebar={toggleSidebar}
                            currentPage="/tabelaPedidos"
            />

            {/********************* titulo *******************/}
            <div className='background-tabelaUsuarios'>
                <div className='titulo-tabelaUsuarios'>
                    <h1>Tabela de Pedidos de Serviço</h1>
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
                                <th>Tipo de Serviço</th>
                                <th>Descrição</th>
                                <th>Solicitante</th>
                                <th>Apartamento</th>
                                <th>Data Solicitação</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                                        Nenhum serviço encontrado
                                    </td>
                                </tr>
                            ) : (
                                pedidos.map((pedido) => (
                                    <tr key={pedido.id}>
                                        <td>{pedido.id}</td>
                                        <td>{pedido.tipo_servico}</td>
                                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {pedido.descricao}
                                        </td>
                                        <td>{pedido.nome_morador || 'Não informado'}</td>
                                        <td>{pedido.apartamento || 'Não informado'}</td>
                                        <td>{new Date(pedido.data_solicitacao).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            <span style={{ 
                                                color: getStatusColor(pedido.status), 
                                                fontWeight: 'bold',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: `${getStatusColor(pedido.status)}20`
                                            }}>
                                                {pedido.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => abrirModalEditar(pedido)}>Editar</button>
                                            <button onClick={() => abrirModalExcluir(pedido)}>Excluir</button>
                                            <button onClick={() => abrirModalVisualizar(pedido)}>Visualizar</button>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                                <p>Deseja excluir o pedido <strong>#{pedidoSelecionado?.id}</strong> - {pedidoSelecionado?.tipo_servico}?</p>
                                <div className='modal-botoes'>
                                    <button 
                                        type="submit"
                                        onClick={() => { 
                                            if (pedidoSelecionado) {
                                                handleExcluir(pedidoSelecionado.id); 
                                            }
                                        }}
                                    >
                                        Confirmar
                                    </button>
                                    <button type="button" onClick={fecharModal}>Cancelar</button>
                                </div>
                            </>
                        ) : tipoModal === 'visualizar' ? (
                            <>
                                <h2>Detalhes do Pedido</h2>
                                <div style={{ textAlign: 'left' }}>
                                    <p><strong>ID:</strong> {pedidoSelecionado?.id}</p>
                                    <p><strong>Tipo de Serviço:</strong> {pedidoSelecionado?.tipo_servico}</p>
                                    <p><strong>Descrição:</strong> {pedidoSelecionado?.descricao}</p>
                                    <p><strong>Solicitante:</strong> {pedidoSelecionado?.nome_morador || 'Não informado'}</p>
                                    <p><strong>Apartamento:</strong> {pedidoSelecionado?.apartamento || 'Não informado'}</p>
                                    <p><strong>Data de Solicitação:</strong> {pedidoSelecionado?.data_solicitacao ? new Date(pedidoSelecionado.data_solicitacao).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                    {pedidoSelecionado?.data_conclusao && (
                                        <p><strong>Data de Conclusão:</strong> {new Date(pedidoSelecionado.data_conclusao).toLocaleDateString('pt-BR')}</p>
                                    )}
                                    <p><strong>Status:</strong> 
                                        <span style={{ 
                                            color: getStatusColor(pedidoSelecionado?.status || ''), 
                                            fontWeight: 'bold',
                                            marginLeft: '8px'
                                        }}>
                                            {pedidoSelecionado?.status}
                                        </span>
                                    </p>
                                </div>
                                <div className='modal-botoes'>
                                    <button type="button" onClick={fecharModal}>Fechar</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>{tipoModal === 'criar' ? 'Criar Novo Pedido' : 'Editar Pedido'}</h2>
                                <form onSubmit={handleSalvarPedido}>
                                    <label>
                                        Tipo de Serviço:
                                        <select name="tipo_servico" defaultValue={pedidoSelecionado?.tipo_servico || ''} required>
                                            <option value="">Selecione...</option>
                                            <option value="Manutenção">Manutenção</option>
                                            <option value="Limpeza">Limpeza</option>
                                            <option value="Elétrica">Elétrica</option>
                                            <option value="Jardinagem">Jardinagem</option>
                                            <option value="Pintura">Pintura</option>
                                            <option value="Outros">Outros</option>
                                        </select>
                                    </label>
                                    <label>
                                        Descrição:
                                        <textarea 
                                            name="descricao" 
                                            defaultValue={pedidoSelecionado?.descricao || ''} 
                                            required 
                                            rows={3}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </label>
                                    <label>
                                        Nome do Solicitante:
                                        <input 
                                            name="nome_morador" 
                                            defaultValue={pedidoSelecionado?.nome_morador || ''} 
                                            required 
                                        />
                                    </label>
                                    <label>
                                        Apartamento:
                                        <input 
                                            name="apartamento" 
                                            defaultValue={pedidoSelecionado?.apartamento || ''} 
                                            placeholder="Ex: Bloco A - Apt 101"
                                            required 
                                        />
                                    </label>
                                    <label>
                                        Data de Solicitação:
                                        <input 
                                            type="date" 
                                            name="data_solicitacao" 
                                            defaultValue={pedidoSelecionado?.data_solicitacao || new Date().toISOString().split('T')[0]} 
                                            required 
                                        />
                                    </label>
                                    <label>
                                        Data de Conclusão (opcional):
                                        <input 
                                            type="date" 
                                            name="data_conclusao" 
                                            defaultValue={pedidoSelecionado?.data_conclusao || ''} 
                                        />
                                    </label>
                                    <label>
                                        Status:
                                        <select name="status" defaultValue={pedidoSelecionado?.status || 'Pendente'} required>
                                            <option value="Pendente">Pendente</option>
                                            <option value="Em andamento">Em andamento</option>
                                            <option value="Concluído">Concluído</option>
                                        </select>
                                    </label>
                                    <input type="hidden" name="morador_id" defaultValue={pedidoSelecionado?.morador_id || 1} />
                                    <input type="hidden" name="funcionario_id" defaultValue={pedidoSelecionado?.funcionario_id || 1} />
                                    
                                    <div className='modal-botoes'>
                                        <button type="submit">Salvar</button>
                                        <button type="button" onClick={fecharModal}>Cancelar</button>
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

export default TabelaPedidosPage;