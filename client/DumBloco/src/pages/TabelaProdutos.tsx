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

const TabelaProdutosPage: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [tipoModal, setTipoModal] = useState<TipoModal>(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const [sidebarAberta, setSidebarAberta] = useState<boolean>(false);
    
    const toggleSidebar = (): void => setSidebarAberta((prev) => !prev);

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

    useEffect(() => {
        const dadosMock: Produto[] = [
            { 
                id: 1, 
                nome: 'Detergente Multiuso', 
                descricao: 'Detergente concentrado para limpeza geral', 
                categoria: 'Limpeza',
                preco: 15.90,
                quantidade_estoque: 50,
                data_cadastro: '2025-01-10',
                status: 'Ativo',
                fornecedor: 'Limpeza Total Ltda'
            },
            { 
                id: 2, 
                nome: 'Lâmpada LED 12W', 
                descricao: 'Lâmpada LED branca fria para áreas comuns', 
                categoria: 'Elétrico',
                preco: 25.50,
                quantidade_estoque: 30,
                data_cadastro: '2025-01-12',
                status: 'Ativo',
                fornecedor: 'Elétrica Silva'
            },
            { 
                id: 3, 
                nome: 'Tinta Acrílica Branca', 
                descricao: 'Tinta acrílica premium para paredes externas', 
                categoria: 'Pintura',
                preco: 89.90,
                quantidade_estoque: 15,
                data_cadastro: '2025-01-15',
                status: 'Ativo',
                fornecedor: 'Tintas & Cores'
            },
            { 
                id: 4, 
                nome: 'Papel Higiênico', 
                descricao: 'Papel higiênico folha dupla - pacote com 12 rolos', 
                categoria: 'Higiene',
                preco: 32.00,
                quantidade_estoque: 0,
                data_cadastro: '2025-01-18',
                status: 'Inativo',
                fornecedor: 'Distribuidora Hygiene'
            },
            { 
                id: 5, 
                nome: 'Cadeado de Segurança', 
                descricao: 'Cadeado com chave para portões e áreas restritas', 
                categoria: 'Segurança',
                preco: 45.00,
                quantidade_estoque: 8,
                data_cadastro: '2025-01-20',
                status: 'Ativo',
                fornecedor: 'Segurança Max'
            },
            { 
                id: 6, 
                nome: 'Fertilizante para Jardim', 
                descricao: 'Fertilizante orgânico para plantas ornamentais', 
                categoria: 'Jardinagem',
                preco: 28.75,
                quantidade_estoque: 22,
                data_cadastro: '2025-01-22',
                status: 'Ativo',
                fornecedor: 'Verde Vida Jardinagem'
            },
        ];
        setTimeout(() => {
            setProdutos(dadosMock);
            setLoading(false);
        }, 500);
    }, []);

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
        if (quantidade === 0) return '#dc3545'; // Vermelho para sem estoque
        if (quantidade <= 10) return '#ffc107'; // Amarelo para estoque baixo
        return '#28a745'; // Verde para estoque normal
    };

    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco);
    };

    const handleSalvarProduto = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const novoProduto: Produto = {
            id: tipoModal === 'criar' ? Date.now() : produtoSelecionado?.id || 0,
            nome: formData.get('nome') as string,
            descricao: formData.get('descricao') as string,
            categoria: formData.get('categoria') as string,
            preco: parseFloat(formData.get('preco') as string),
            quantidade_estoque: parseInt(formData.get('quantidade_estoque') as string),
            data_cadastro: formData.get('data_cadastro') as string,
            status: formData.get('status') as string,
            fornecedor: formData.get('fornecedor') as string,
        };

        if (tipoModal === 'criar') {
            setProdutos((prev) => [...prev, novoProduto]);
        } else {
            setProdutos((prev) =>
                prev.map((p) => (p.id === novoProduto.id ? novoProduto : p))
            );
        }

        fecharModal();
    };

    const handleExcluir = (id: number) => {
        if (confirm('Deseja excluir este produto?')) {
            setProdutos((prev) => prev.filter((p) => p.id !== id));
        }
    };

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
                            {produtos.map((produto) => (
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
                                <p>Deseja excluir o produto <strong>{produtoSelecionado?.nome}</strong>?</p>
                                <div className='modal-botoes'>
                                    <button 
                                        type="submit"
                                        onClick={() => { 
                                            if (produtoSelecionado) {
                                                handleExcluir(produtoSelecionado.id); 
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
