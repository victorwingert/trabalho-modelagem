"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import SidebarNavigation from "../components/sidebar-navigation"

// Interface para funcionário
interface Funcionario {
  id: number
  nome: string
  cpf: string
  telefone: string
  funcao: string
  id_entidade: number

  // Campos retornados pela view (se houver)
  nomeEntidade?: string
  tipoEntidade?: string
}

type TipoModal = "criar" | "editar" | "excluir" | "visualizar" | null

// Interface para parâmetros de consulta da API
interface ParametrosConsulta {
  pagina: number
  itensPorPagina: number
  termoPesquisa: string
  campoOrdenacao?: string
  direcaoOrdenacao?: "asc" | "desc"
  filtroFuncao?: string
  filtroEntidade?: string
}

// Interface para resposta paginada da API
interface RespostaPaginada<T> {
  dados: T[]
  totalItens: number
  totalPaginas: number
  paginaAtual: number
  itensPorPagina: number
}

// Interface para opções dos selects
interface OpcoesEntidades {
  id: number
  nome: string
  tipo?: string
}

type TabelaFuncionariosPageProps = {}

const TabelaFuncionariosPage: React.FC<TabelaFuncionariosPageProps> = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [tipoModal, setTipoModal] = useState<TipoModal>(null)
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null)
  const [sidebarAberta, setSidebarAberta] = useState<boolean>(false)

  // Estados para opções dos selects
  const [entidadesDisponiveis, setEntidadesDisponiveis] = useState<OpcoesEntidades[]>([])
  const [funcoesDisponiveis, setFuncoesDisponiveis] = useState<string[]>([
    "Porteiro",
    "Zelador",
    "Faxineiro",
    "Segurança",
    "Administrador",
    "Manutenção",
    "Jardineiro",
  ])

  // Estados para controle de consulta
  const [parametrosConsulta, setParametrosConsulta] = useState<ParametrosConsulta>({
    pagina: 1,
    itensPorPagina: 8,
    termoPesquisa: "",
    campoOrdenacao: "nome",
    direcaoOrdenacao: "asc",
    filtroFuncao: "",
    filtroEntidade: "",
  })

  // Estado para debounce da pesquisa
  const [termoPesquisaInput, setTermoPesquisaInput] = useState<string>("")
  const [erro, setErro] = useState<string>("")

  const toggleSidebar = (): void => setSidebarAberta((prev) => !prev)

  const abrirModalCriar = (): void => {
    setTipoModal("criar")
    setFuncionarioSelecionado(null)
  }

  const abrirModalEditar = (funcionario: Funcionario): void => {
    setTipoModal("editar")
    setFuncionarioSelecionado(funcionario)
  }

  const abrirModalExcluir = (funcionario: Funcionario): void => {
    setTipoModal("excluir")
    setFuncionarioSelecionado(funcionario)
  }

  const abrirModalVisualizar = (funcionario: Funcionario): void => {
    setTipoModal("visualizar")
    setFuncionarioSelecionado(funcionario)
  }

  const fecharModal = (): void => {
    setTipoModal(null)
    setFuncionarioSelecionado(null)
  }

  // Configuração da API
  const API_BASE_URL = "http://localhost:3001/api"

  // ===== CHAMADAS PARA API =====

  // Buscar funcionários
  const buscarFuncionarios = useCallback(
    async (params: ParametrosConsulta): Promise<RespostaPaginada<Funcionario>> => {
      setLoading(true)
      setErro("")

      try {
        // Construir query parameters
        const queryParams = new URLSearchParams({
          pagina: params.pagina.toString(),
          itensPorPagina: params.itensPorPagina.toString(),
          termoPesquisa: params.termoPesquisa,
          campoOrdenacao: params.campoOrdenacao || "nome",
          direcaoOrdenacao: params.direcaoOrdenacao || "asc",
          filtroFuncao: params.filtroFuncao || "",
          filtroEntidade: params.filtroEntidade || "",
        })

        const response = await fetch(`${API_BASE_URL}/funcionarios?${queryParams}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status} - ${response.statusText}`)
        }

        const resultado: RespostaPaginada<Funcionario> = await response.json()
        setLoading(false)
        return resultado
      } catch (error) {
        setLoading(false)
        const mensagemErro = error instanceof Error ? error.message : "Erro desconhecido ao buscar funcionários"
        setErro(mensagemErro)
        console.error("Erro ao buscar funcionários:", error)

        // Retornar estrutura vazia em caso de erro
        return {
          dados: [],
          totalItens: 0,
          totalPaginas: 0,
          paginaAtual: params.pagina,
          itensPorPagina: params.itensPorPagina,
        }
      }
    },
    [API_BASE_URL],
  )

  // Buscar opções para os selects
  const carregarOpcoes = useCallback(async () => {
    try {
      // Buscar entidades (se necessário)
      // const responseEntidades = await fetch(`${API_BASE_URL}/entidades`);
      // if (responseEntidades.ok) {
      //     const entidades: OpcoesEntidades[] = await responseEntidades.json();
      //     setEntidadesDisponiveis(entidades);
      // }
    } catch (error) {
      console.error("Erro ao carregar opções:", error)
    }
  }, [API_BASE_URL])

  // ===== CONTROLE DE PARÂMETROS =====

  // Atualizar página
  const mudarPagina = useCallback((novaPagina: number) => {
    setParametrosConsulta((prev) => ({
      ...prev,
      pagina: novaPagina,
    }))
  }, [])

  // Atualizar pesquisa com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setParametrosConsulta((prev) => ({
        ...prev,
        pagina: 1, // Resetar para primeira página ao pesquisar
        termoPesquisa: termoPesquisaInput,
      }))
    }, 500) // 500ms de delay para debounce

    return () => clearTimeout(timer)
  }, [termoPesquisaInput])

  // Atualizar ordenação
  const mudarOrdenacao = useCallback((campo: string) => {
    setParametrosConsulta((prev) => ({
      ...prev,
      pagina: 1,
      campoOrdenacao: campo,
      direcaoOrdenacao: prev.campoOrdenacao === campo && prev.direcaoOrdenacao === "asc" ? "desc" : "asc",
    }))
  }, [])

  // Atualizar filtro de função
  const mudarFiltroFuncao = useCallback((funcao: string) => {
    setParametrosConsulta((prev) => ({
      ...prev,
      pagina: 1,
      filtroFuncao: funcao,
    }))
  }, [])

  // Atualizar filtro de entidade
  const mudarFiltroEntidade = useCallback((entidadeId: string) => {
    setParametrosConsulta((prev) => ({
      ...prev,
      pagina: 1,
      filtroEntidade: entidadeId,
    }))
  }, [])

  // ===== RESULTADO DA CONSULTA =====
  const [resultadoConsulta, setResultadoConsulta] = useState<RespostaPaginada<Funcionario>>({
    dados: [],
    totalItens: 0,
    totalPaginas: 0,
    paginaAtual: 1,
    itensPorPagina: 8,
  })

  // Carregar opções na inicialização
  useEffect(() => {
    carregarOpcoes()
  }, [carregarOpcoes])

  // Executar consulta quando parâmetros mudarem
  useEffect(() => {
    buscarFuncionarios(parametrosConsulta).then((resultado) => {
      setResultadoConsulta(resultado)
      setFuncionarios(resultado.dados)
    })
  }, [parametrosConsulta, buscarFuncionarios])

  // ===== FUNÇÕES DE NAVEGAÇÃO =====
  const irParaPagina = useCallback(
    (pagina: number) => {
      if (pagina >= 1 && pagina <= resultadoConsulta.totalPaginas) {
        mudarPagina(pagina)
      }
    },
    [resultadoConsulta.totalPaginas, mudarPagina],
  )

  const paginaAnterior = useCallback(() => {
    irParaPagina(resultadoConsulta.paginaAtual - 1)
  }, [irParaPagina, resultadoConsulta.paginaAtual])

  const proximaPagina = useCallback(() => {
    irParaPagina(resultadoConsulta.paginaAtual + 1)
  }, [irParaPagina, resultadoConsulta.paginaAtual])

  // Gerar números das páginas visíveis (máximo 5)
  const obterPaginasVisiveis = useCallback((): number[] => {
    const { totalPaginas, paginaAtual } = resultadoConsulta
    const maxPaginasVisiveis = 5

    if (totalPaginas <= maxPaginasVisiveis) {
      return Array.from({ length: totalPaginas }, (_, i) => i + 1)
    }

    let inicio = Math.max(paginaAtual - 2, 1)
    const fim = Math.min(inicio + maxPaginasVisiveis - 1, totalPaginas)

    // Ajustar se chegou no final
    if (fim - inicio < maxPaginasVisiveis - 1) {
      inicio = Math.max(fim - maxPaginasVisiveis + 1, 1)
    }

    return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i)
  }, [resultadoConsulta])

  // ===== OPERAÇÕES CRUD =====

  // Tipo para dados de criação
  type DadosCriacaoFuncionario = {
    nome: string
    cpf: string
    telefone: string
    funcao: string
    id_entidade: number
  }

  const criarFuncionario = async (dadosFuncionario: DadosCriacaoFuncionario): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/funcionarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosFuncionario),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao criar funcionário: ${response.status} - ${errorText}`)
      }

      // Recarregar dados
      const resultado = await buscarFuncionarios(parametrosConsulta)
      setResultadoConsulta(resultado)
      setFuncionarios(resultado.dados)
    } catch (error) {
      console.error("Erro ao criar funcionário:", error)
      setErro(error instanceof Error ? error.message : "Erro ao criar funcionário")
      throw error
    }
  }

  const editarFuncionario = async (id: number, dadosFuncionario: Partial<DadosCriacaoFuncionario>): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/funcionarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosFuncionario),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao editar funcionário: ${response.status} - ${errorText}`)
      }

      // Recarregar dados
      const resultado = await buscarFuncionarios(parametrosConsulta)
      setResultadoConsulta(resultado)
      setFuncionarios(resultado.dados)
    } catch (error) {
      console.error("Erro ao editar funcionário:", error)
      setErro(error instanceof Error ? error.message : "Erro ao editar funcionário")
      throw error
    }
  }

  const excluirFuncionario = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/funcionarios/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao excluir funcionário: ${response.status} - ${errorText}`)
      }

      // Recarregar dados
      const resultado = await buscarFuncionarios(parametrosConsulta)
      setResultadoConsulta(resultado)
      setFuncionarios(resultado.dados)
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error)
      setErro(error instanceof Error ? error.message : "Erro ao excluir funcionário")
      throw error
    }
  }

  const handleSalvarFuncionario = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const dadosFuncionario: DadosCriacaoFuncionario = {
      nome: formData.get("nome") as string,
      cpf: formData.get("cpf") as string,
      telefone: formData.get("telefone") as string,
      funcao: formData.get("funcao") as string,
      id_entidade: Number.parseInt(formData.get("id_entidade") as string) || 1,
    }

    try {
      if (tipoModal === "criar") {
        await criarFuncionario(dadosFuncionario)
      } else if (tipoModal === "editar" && funcionarioSelecionado) {
        await editarFuncionario(funcionarioSelecionado.id, dadosFuncionario)
      }
      fecharModal()
    } catch (error) {
      // Erro já foi tratado nas funções acima
    }
  }

  const handleExcluir = async (): Promise<void> => {
    if (funcionarioSelecionado) {
      try {
        await excluirFuncionario(funcionarioSelecionado.id)
        fecharModal()
      } catch (error) {
        // Erro já foi tratado na função acima
      }
    }
  }

  return (
    <div className="pagina-tabelaUsuarios">
      {/********************* Sidebar *******************/}
      <SidebarNavigation
        sidebarAberta={sidebarAberta}
        toggleSidebar={toggleSidebar}
        currentPage="/tabelaFuncionarios"
      />

      {/********************* titulo *******************/}
      <div className="background-tabelaUsuarios">
        <div className="titulo-tabelaUsuarios">
          <h1>Tabela de Funcionários</h1>
        </div>

        <div className="conteudo-tabelaUsuarios">
          {/********************* Mensagem de erro *******************/}
          {erro && (
            <div
              style={{
                backgroundColor: "#ffebee",
                color: "#c62828",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "4px",
              }}
            >
              {erro}
            </div>
          )}

          {/********************* pesquisa, filtros e criar *******************/}
          <div
            className="pesquisa-tabelaUsuarios"
            style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}
          >
            <input
              type="text"
              placeholder="Pesquisar por nome, CPF, telefone, função..."
              value={termoPesquisaInput}
              onChange={(e) => setTermoPesquisaInput(e.target.value)}
              style={{ flex: 1 }}
            />

            <select
              value={parametrosConsulta.filtroFuncao}
              onChange={(e) => mudarFiltroFuncao(e.target.value)}
              style={{ padding: "8px" }}
            >
              <option value="">Todas as Funções</option>
              {funcoesDisponiveis.map((funcao) => (
                <option key={funcao} value={funcao}>
                  {funcao}
                </option>
              ))}
            </select>

            <button onClick={abrirModalCriar}>Adicionar Funcionário</button>
          </div>

          {/********************* estatísticas *******************/}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "20px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            <span>Total de funcionários: {resultadoConsulta.totalItens}</span>
            {parametrosConsulta.filtroFuncao && (
              <span>
                {parametrosConsulta.filtroFuncao}: {resultadoConsulta.totalItens} funcionários
              </span>
            )}
          </div>

          {/********************* tabela *******************/}
          <table className="tabela-usuarios">
            <thead>
              <tr>
                <th onClick={() => mudarOrdenacao("id")} style={{ cursor: "pointer", minWidth: "60px" }}>
                  ID{" "}
                  {parametrosConsulta.campoOrdenacao === "id" &&
                    (parametrosConsulta.direcaoOrdenacao === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => mudarOrdenacao("nome")} style={{ cursor: "pointer", minWidth: "200px" }}>
                  Nome{" "}
                  {parametrosConsulta.campoOrdenacao === "nome" &&
                    (parametrosConsulta.direcaoOrdenacao === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => mudarOrdenacao("cpf")} style={{ cursor: "pointer", minWidth: "140px" }}>
                  CPF{" "}
                  {parametrosConsulta.campoOrdenacao === "cpf" &&
                    (parametrosConsulta.direcaoOrdenacao === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => mudarOrdenacao("telefone")} style={{ cursor: "pointer", minWidth: "140px" }}>
                  Telefone{" "}
                  {parametrosConsulta.campoOrdenacao === "telefone" &&
                    (parametrosConsulta.direcaoOrdenacao === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => mudarOrdenacao("funcao")} style={{ cursor: "pointer", minWidth: "120px" }}>
                  Função{" "}
                  {parametrosConsulta.campoOrdenacao === "funcao" &&
                    (parametrosConsulta.direcaoOrdenacao === "asc" ? "↑" : "↓")}
                </th>
                <th style={{ minWidth: "200px" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    Carregando funcionários...
                  </td>
                </tr>
              ) : funcionarios.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    {parametrosConsulta.termoPesquisa || parametrosConsulta.filtroFuncao
                      ? "Nenhum funcionário encontrado com os filtros aplicados"
                      : "Nenhum funcionário cadastrado"}
                  </td>
                </tr>
              ) : (
                funcionarios.map((funcionario) => (
                  <tr key={funcionario.id}>
                    <td>{funcionario.id}</td>
                    <td>{funcionario.nome}</td>
                    <td>{funcionario.cpf}</td>
                    <td>{funcionario.telefone}</td>
                    <td style={{ textAlign: "center" }}>{funcionario.funcao}</td>
                    <td>
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => abrirModalVisualizar(funcionario)}
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                        >
                          Visualizar
                        </button>
                        <button
                          onClick={() => abrirModalEditar(funcionario)}
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => abrirModalExcluir(funcionario)}
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/********************* paginacao *******************/}
          {resultadoConsulta.totalPaginas > 1 && (
            <div className="paginacao-tabelaUsuarios">
              <button
                onClick={paginaAnterior}
                disabled={resultadoConsulta.paginaAtual === 1}
                style={{
                  opacity: resultadoConsulta.paginaAtual === 1 ? 0.5 : 1,
                  cursor: resultadoConsulta.paginaAtual === 1 ? "not-allowed" : "pointer",
                }}
              >
                {"⮜"}
              </button>

              {obterPaginasVisiveis().map((numeroPagina) => (
                <button
                  key={numeroPagina}
                  onClick={() => irParaPagina(numeroPagina)}
                  className={resultadoConsulta.paginaAtual === numeroPagina ? "ativo" : ""}
                >
                  {numeroPagina}
                </button>
              ))}

              <button
                onClick={proximaPagina}
                disabled={resultadoConsulta.paginaAtual === resultadoConsulta.totalPaginas}
                style={{
                  opacity: resultadoConsulta.paginaAtual === resultadoConsulta.totalPaginas ? 0.5 : 1,
                  cursor: resultadoConsulta.paginaAtual === resultadoConsulta.totalPaginas ? "not-allowed" : "pointer",
                }}
              >
                {"⮞"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/********************* Modal de Criar/Editar *******************/}
      {(tipoModal === "criar" || tipoModal === "editar") && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div
            className="modal-conteudo"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <h2>{tipoModal === "criar" ? "Adicionar Funcionário" : "Editar Funcionário"}</h2>

            <form onSubmit={handleSalvarFuncionario}>
              <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "1fr 1fr" }}>
                <div style={{ gridColumn: "span 2" }}>
                  <label>Nome *</label>
                  <input type="text" name="nome" required defaultValue={funcionarioSelecionado?.nome || ""} />
                </div>

                <div>
                  <label>CPF *</label>
                  <input type="text" name="cpf" required defaultValue={funcionarioSelecionado?.cpf || ""} />
                </div>

                <div>
                  <label>Telefone *</label>
                  <input type="text" name="telefone" required defaultValue={funcionarioSelecionado?.telefone || ""} />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label>Função *</label>
                  <select name="funcao" required defaultValue={funcionarioSelecionado?.funcao || ""}>
                    <option value="">Selecione uma função</option>
                    {funcoesDisponiveis.map((funcao) => (
                      <option key={funcao} value={funcao}>
                        {funcao}
                      </option>
                    ))}
                  </select>
                </div>

                <input type="hidden" name="id_entidade" value="1" />
              </div>

              <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/********************* Modal de Excluir *******************/}
      {tipoModal === "excluir" && funcionarioSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div
            className="modal-conteudo"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            style={{ maxWidth: "400px" }}
          >
            <h2>Excluir Funcionário</h2>
            <p>
              Tem certeza que deseja excluir o funcionário <strong>{funcionarioSelecionado.nome}</strong>?
            </p>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button type="button" onClick={fecharModal}>
                Cancelar
              </button>
              <button type="button" onClick={handleExcluir} style={{ backgroundColor: "#c62828", color: "#fff" }}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/********************* Modal de Visualizar *******************/}
      {tipoModal === "visualizar" && funcionarioSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div
            className="modal-conteudo"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            style={{ maxWidth: "500px" }}
          >
            <h2>Detalhes do Funcionário</h2>
            <p>
              <strong>Nome:</strong> {funcionarioSelecionado.nome}
            </p>
            <p>
              <strong>CPF:</strong> {funcionarioSelecionado.cpf}
            </p>
            <p>
              <strong>Telefone:</strong> {funcionarioSelecionado.telefone}
            </p>
            <p>
              <strong>Função:</strong> {funcionarioSelecionado.funcao}
            </p>
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button type="button" onClick={fecharModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TabelaFuncionariosPage
