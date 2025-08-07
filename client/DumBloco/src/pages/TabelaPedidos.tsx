import React, { useEffect, useState } from 'react';
import SidebarNavigation from '../components/sidebar-navigation';

interface Pedido {
    id: number;
    tipo_servico: string;
    descricao: string;
    data_solicitacao: string;
    data_conclusao?: string;
    status: string;
    apartamento_id: number;
    morador_id: number;
    nome_morador?: string;
    apartamento?: string;
}

type TipoModal = 'criar' | 'editar' | 'excluir' | 'visualizar' | null;

const TabelaPedidosPage: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [tipoModal, setTipoModal] = useState<TipoModal>(null);
    const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
    const [sidebarAberta, setSidebarAberta] = useState<boolean>(false);
    
    const toggleSidebar = (): void => setSidebarAberta((prev) => !prev);

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

    useEffect(() => {
        const dadosMock: Pedido[] = [
            { 
                id: 1, 
                tipo_servico: 'Manutenção', 
                descricao: 'Reparo no encanamento do banheiro', 
                data_solicitacao: '2025-01-15',
                data_conclusao: '2025-01-18',
                status: 'Concluído',
                apartamento_id: 101,
                morador_id: 1,
                nome_morador: 'João Silva',
                apartamento: 'Bloco A - Apt 101'
            },
            { 
                id: 2, 
                tipo_servico: 'Limpeza', 
                descricao: 'Limpeza do corredor do 5º andar', 
                data_solicitacao: '2025-01-20',
                status: 'Em andamento',
                apartamento_id: 502,
                morador_id: 2,
                nome_morador: 'Maria Santos',
                apartamento: 'Bloco B - Apt 502'
            },
            { 
                id: 3, 
                tipo_servico: 'Elétrica', 
                descricao: 'Troca de lâmpadas do hall de entrada', 
                data_solicitacao: '2025-01-22',
                status: 'Pendente',
                apartamento_id: 304,
                morador_id: 3,
                nome_morador: 'Carlos Oliveira',
                apartamento: 'Bloco C - Apt 304'
            },
            { 
                id: 4, 
                tipo_servico: 'Jardinagem', 
                descricao: 'Poda das árvores da área comum', 
                data_solicitacao: '2025-01-25',
                status: 'Pendente',
                apartamento_id: 201,
                morador_id: 4,
                nome_morador: 'Ana Costa',
                apartamento: 'Bloco A - Apt 201'
            },
            { 
                id: 5, 
                tipo_servico: 'Pintura', 
                descricao: 'Pintura da parede externa do bloco', 
                data_solicitacao: '2025-01-28',
                status: 'Em andamento',
                apartamento_id: 403,
                morador_id: 5,
                nome_morador: 'Pedro Almeida',
                apartamento: 'Bloco D - Apt 403'
            },
        ];
        setTimeout(() => {
            setPedidos(dadosMock);
            setLoading(false);
        }, 500);
    }, []);

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

    const handleSalvarPedido = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const novoPedido: Pedido = {
            id: tipoModal === 'criar' ? Date.now() : pedidoSelecionado?.id || 0,
            tipo_servico: formData.get('tipo_servico') as string,
            descricao: formData.get('descricao') as string,
            data_solicitacao: formData.get('data_solicitacao') as string,
            data_conclusao: formData.get('data_conclusao') as string || undefined,
            status: formData.get('status') as string,
            apartamento_id: parseInt(formData.get('apartamento_id') as string),
            morador_id: parseInt(formData.get('morador_id') as string),
            nome_morador: formData.get('nome_morador') as string,
            apartamento: formData.get('apartamento') as string,
        };

        if (tipoModal === 'criar') {
            setPedidos((prev) => [...prev, novoPedido]);
        } else {
            setPedidos((prev) =>
                prev.map((p) => (p.id === novoPedido.id ? novoPedido : p))
            );
        }

        fecharModal();
    };

    const handleExcluir = (id: number) => {
        if (confirm('Deseja excluir este pedido?')) {
            setPedidos((prev) => prev.filter((p) => p.id !== id));
        }
    };

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
                            {pedidos.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td>{pedido.id}</td>
                                    <td>{pedido.tipo_servico}</td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {pedido.descricao}
                                    </td>
                                    <td>{pedido.nome_morador}</td>
                                    <td>{pedido.apartamento}</td>
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
                                <p>Deseja excluir o pedido <strong>#{pedidoSelecionado?.id}</strong> - {pedidoSelecionado?.tipo_servico}?</p>
                                <div className='modal-botoes'>
                                    <button 
                                        type="submit"
                                        onClick={() => { 
                                            if (pedidoSelecionado) {
                                                handleExcluir(pedidoSelecionado.id); 
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
                                <h2>Detalhes do Pedido</h2>
                                <div style={{ textAlign: 'left' }}>
                                    <p><strong>ID:</strong> {pedidoSelecionado?.id}</p>
                                    <p><strong>Tipo de Serviço:</strong> {pedidoSelecionado?.tipo_servico}</p>
                                    <p><strong>Descrição:</strong> {pedidoSelecionado?.descricao}</p>
                                    <p><strong>Solicitante:</strong> {pedidoSelecionado?.nome_morador}</p>
                                    <p><strong>Apartamento:</strong> {pedidoSelecionado?.apartamento}</p>
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
                                            defaultValue={pedidoSelecionado?.data_solicitacao || ''} 
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
                                    <input type="hidden" name="apartamento_id" defaultValue={pedidoSelecionado?.apartamento_id || 1} />
                                    <input type="hidden" name="morador_id" defaultValue={pedidoSelecionado?.morador_id || 1} />
                                    
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