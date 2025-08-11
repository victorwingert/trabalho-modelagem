import React, { useEffect, useState } from 'react';
import SidebarNavigation from '../components/sidebar-navigation';

interface Produto {
    id: number;
    nome: string;
    descricao: string;
    categoria: string;
    preco: number;
    quantidade_estoque: number;
    data_cadastro: string;
    status: string;
    fornecedor: string;
}

type TipoModal = 'criar' | 'editar' | 'excluir' | 'visualizar' | null;

const API_BASE_URL = 'http://localhost:3001/api'; 

const TabelaProdutosPage: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [tipoModal, setTipoModal] = useState<TipoModal>(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const [sidebarAberta, setSidebarAberta] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const toggleSidebar = (): void => setSidebarAberta((prev) => !prev);

    // Função para buscar produtos da API
    const buscarProdutos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/produtos`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }
            
            const produtosData = await response.json();
            setProdutos(produtosData);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            setError('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    // Carregar produtos ao montar o componente
    useEffect(() => {
        buscarProdutos();
    }, []);

    const abrirModalCriar = () => {
        setTipoModal('criar');
        setProdutoSelecionado(null);
    };

    const abrirModalEditar = (produto: Produto) => {
        setTipoModal('editar');
        setProdutoSelecionado(produto);
    };

    const abrirModalExcluir = (produto: Produto) => {
        setTipoModal('excluir');
        setProdutoSelecionado(produto);
    };

    const abrirModalVisualizar = (produto: Produto) => {
        setTipoModal('visualizar');
        setProdutoSelecionado(produto);
    };

    const fecharModal = () => {
        setTipoModal(null);
        setProdutoSelecionado(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ativo':
                return '#28a745';
            case 'Inativo':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    const getEstoqueColor = (quantidade: number) => {
        if (quantidade === 0) return '#dc3545';
        if (quantidade <= 10) return '#ffc107';
        return '#28a745';
    };

    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco);
    };

    const handleSalvarProduto = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const dadosProduto = {
            nome: formData.get('nome') as string,
            descricao: formData.get('descricao') as string,
            categoria: formData.get('categoria') as string,
            preco: parseFloat(formData.get('preco') as string),
            quantidade_estoque: parseInt(formData.get('quantidade_estoque') as string),
            data_cadastro: formData.get('data_cadastro') as string,
            status: formData.get('status') as string,
            fornecedor: formData.get('fornecedor') as string,
        };

        try {
            let response;
            
            if (tipoModal === 'criar') {
                // Criar novo produto
                response = await fetch(`${API_BASE_URL}/produtos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosProduto),
                });
            } else {
                // Editar produto existente
                response = await fetch(`${API_BASE_URL}/produtos/${produtoSelecionado?.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosProduto),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao salvar produto');
            }

            const result = await response.json();
            console.log(result.message); // Log da mensagem de sucesso

            // Recarregar a lista de produtos
            await buscarProdutos();
            fecharModal();
            
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            setError(error instanceof Error ? error.message : 'Erro ao salvar produto');
        }
    };

    const handleExcluir = async (id: number) => {
        if (!confirm('Deseja excluir este produto?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao excluir produto');
            }

            const result = await response.json();
            console.log(result.message); // Log da mensagem de sucesso

            // Recarregar a lista de produtos
            await buscarProdutos();
            fecharModal();
            
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            setError(error instanceof Error ? error.message : 'Erro ao excluir produto');
        }
    };

    // Mostrar loading
    if (loading) {
        return (
            <div className="pagina-tabelaUsuarios">
                <SidebarNavigation 
                    sidebarAberta={sidebarAberta}
                    toggleSidebar={toggleSidebar}
                    currentPage="/tabelaProdutos"
                />
                <div className='background-tabelaUsuarios'>
                    <div className='titulo-tabelaUsuarios'>
                        <h1>Carregando produtos...</h1>
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
                    currentPage="/tabelaProdutos"
                />
                <div className='background-tabelaUsuarios'>
                    <div className='titulo-tabelaUsuarios'>
                        <h1>Erro ao carregar produtos</h1>
                        <p>{error}</p>
                        <button onClick={buscarProdutos}>Tentar novamente</button>
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
                currentPage="/tabelaProdutos"
            />

            {/********************* titulo *******************/}
            <div className='background-tabelaUsuarios'>
                <div className='titulo-tabelaUsuarios'>
                    <h1>Tabela de Produtos</h1>
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
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Preço</th>
                                <th>Estoque</th>
                                <th>Fornecedor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                                        Nenhum produto encontrado
                                    </td>
                                </tr>
                            ) : (
                                produtos.map((produto) => (
                                    <tr key={produto.id}>
                                        <td>{produto.id}</td>
                                        <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {produto.nome}
                                        </td>
                                        <td>{produto.categoria}</td>
                                        <td style={{ fontWeight: 'bold', color: '#2c5aa0' }}>
                                            {formatarPreco(produto.preco)}
                                        </td>
                                        <td>
                                            <span style={{ 
                                                color: getEstoqueColor(produto.quantidade_estoque), 
                                                fontWeight: 'bold',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: `${getEstoqueColor(produto.quantidade_estoque)}20`
                                            }}>
                                                {produto.quantidade_estoque} un.
                                            </span>
                                        </td>
                                        <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {produto.fornecedor}
                                        </td>
                                        <td>
                                            <span style={{ 
                                                color: getStatusColor(produto.status), 
                                                fontWeight: 'bold',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: `${getStatusColor(produto.status)}20`
                                            }}>
                                                {produto.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => abrirModalEditar(produto)}>Editar</button>
                                            <button onClick={() => abrirModalExcluir(produto)}>Excluir</button>
                                            <button onClick={() => abrirModalVisualizar(produto)}>Visualizar</button>
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
                                <p>Deseja excluir o produto <strong>{produtoSelecionado?.nome}</strong>?</p>
                                <div className='modal-botoes'>
                                    <button 
                                        type="submit"
                                        onClick={() => { 
                                            if (produtoSelecionado) {
                                                handleExcluir(produtoSelecionado.id); 
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
                                <h2>Detalhes do Produto</h2>
                                <div style={{ textAlign: 'left' }}>
                                    <p><strong>ID:</strong> {produtoSelecionado?.id}</p>
                                    <p><strong>Nome:</strong> {produtoSelecionado?.nome}</p>
                                    <p><strong>Descrição:</strong> {produtoSelecionado?.descricao}</p>
                                    <p><strong>Categoria:</strong> {produtoSelecionado?.categoria}</p>
                                    <p><strong>Preço:</strong> {produtoSelecionado?.preco ? formatarPreco(produtoSelecionado.preco) : 'N/A'}</p>
                                    <p><strong>Quantidade em Estoque:</strong> 
                                        <span style={{ 
                                            color: getEstoqueColor(produtoSelecionado?.quantidade_estoque || 0), 
                                            fontWeight: 'bold',
                                            marginLeft: '8px'
                                        }}>
                                            {produtoSelecionado?.quantidade_estoque} unidades
                                        </span>
                                    </p>
                                    <p><strong>Fornecedor:</strong> {produtoSelecionado?.fornecedor}</p>
                                    <p><strong>Data de Cadastro:</strong> {produtoSelecionado?.data_cadastro ? new Date(produtoSelecionado.data_cadastro).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                    <p><strong>Status:</strong> 
                                        <span style={{ 
                                            color: getStatusColor(produtoSelecionado?.status || ''), 
                                            fontWeight: 'bold',
                                            marginLeft: '8px'
                                        }}>
                                            {produtoSelecionado?.status}
                                        </span>
                                    </p>
                                </div>
                                <div className='modal-botoes'>
                                    <button type="button" onClick={fecharModal}>Fechar</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>{tipoModal === 'criar' ? 'Criar Novo Produto' : 'Editar Produto'}</h2>
                                <form onSubmit={handleSalvarProduto}>
                                    <label>
                                        Nome do Produto:
                                        <input 
                                            name="nome" 
                                            defaultValue={produtoSelecionado?.nome || ''} 
                                            required 
                                        />
                                    </label>
                                    <label>
                                        Descrição:
                                        <textarea 
                                            name="descricao" 
                                            defaultValue={produtoSelecionado?.descricao || ''} 
                                            required 
                                            rows={3}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </label>
                                    <label>
                                        Categoria:
                                        <select name="categoria" defaultValue={produtoSelecionado?.categoria || ''} required>
                                            <option value="">Selecione...</option>
                                            <option value="Limpeza">Limpeza</option>
                                            <option value="Elétrico">Elétrico</option>
                                            <option value="Pintura">Pintura</option>
                                            <option value="Higiene">Higiene</option>
                                            <option value="Segurança">Segurança</option>
                                            <option value="Jardinagem">Jardinagem</option>
                                            <option value="Manutenção">Manutenção</option>
                                            <option value="Outros">Outros</option>
                                        </select>
                                    </label>
                                    <label>
                                        Preço (R$):
                                        <input 
                                            type="number" 
                                            step="0.01" 
                                            min="0"
                                            name="preco" 
                                            defaultValue={produtoSelecionado?.preco || ''} 
                                            required 
                                        />
                                    </label>
                                    <label>
                                        Quantidade em Estoque:
                                        <input 
                                            type="number" 
                                            min="0"
                                            name="quantidade_estoque" 
                                            defaultValue={produtoSelecionado?.quantidade_estoque || ''} 
                                            required 
                                        />
                                    </label>
                                    <label>
                                        Fornecedor:
                                        <input 
                                            name="fornecedor" 
                                            defaultValue={produtoSelecionado?.fornecedor || ''} 
                                            required 
                                        />
                                    </label>
                                    <label>
                                        Data de Cadastro:
                                        <input 
                                            type="date" 
                                            name="data_cadastro" 
                                            defaultValue={produtoSelecionado?.data_cadastro || new Date().toISOString().split('T')[0]} 
                                            required 
                                        />
                                    </label>
                                    <label>
                                        Status:
                                        <select name="status" defaultValue={produtoSelecionado?.status || 'Ativo'} required>
                                            <option value="Ativo">Ativo</option>
                                            <option value="Inativo">Inativo</option>
                                        </select>
                                    </label>
                                    
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

export default TabelaProdutosPage;