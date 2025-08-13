"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import SidebarNavigation from "../components/sidebar-navigation"

// Interface para proprietário
interface Proprietario {
  id: number
  nome: string
  cpf: string
  telefone: string
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

type TabelaProprietariosPageProps = {}

const TabelaProprietariosPage: React.FC<TabelaProprietariosPageProps> = () => {
  const [proprietarios, setProprietarios] = useState<Proprietario[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [tipoModal, setTipoModal] = useState<TipoModal>(null)
  const [proprietarioSelecionado, setProprietarioSelecionado] = useState<Proprietario | null>(null)
  const [sidebarAberta, setSidebarAberta] = useState<boolean>(false)

  // Estados para opções dos selects
  const [entidadesDisponiveis, setEntidadesDisponiveis] = useState<OpcoesEntidades[]>([])

  // Estados para controle de consulta
  const [parametrosConsulta, setParametrosConsulta] = useState<ParametrosConsulta>({
    pagina: 1,
    itensPorPagina: 8,
    termoPesquisa: "",
    campoOrdenacao: "nome",
    direcaoOrdenacao: "asc",
    filtroEntidade: "",
  })

  // Estado para debounce da pesquisa
  const [termoPesquisaInput, setTermoPesquisaInput] = useState<string>("")
  const [erro, setErro] = useState<string>("")

  const toggleSidebar = (): void => setSidebarAberta((prev) => !prev)

  const abrirModalCriar = (): void => {
    setTipoModal("criar")
    setProprietarioSelecionado(null)
  }

  const abrirModalEditar = (proprietario: Proprietario): void => {
    setTipoModal("editar")
    setProprietarioSelecionado(proprietario)
  }

  const abrirModalExcluir = (proprietario: Proprietario): void => {
    setTipoModal("excluir")
    setProprietarioSelecionado(proprietario)
  }

  const abrirModalVisualizar = (proprietario: Proprietario): void => {
    setTipoModal("visualizar")
    setProprietarioSelecionado(proprietario)
  }

  const fecharModal = (): void => {
    setTipoModal(null)
    setProprietarioSelecionado(null)
  }

  // Configuração da API
  const API_BASE_URL = "http://localhost:3001/api"

  // ===== CHAMADAS PARA API =====

  // Buscar proprietários
  const buscarProprietarios = useCallback(
    async (params: ParametrosConsulta): Promise<RespostaPaginada<Proprietario>> => {
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
          filtroEntidade: params.filtroEntidade || "",
        })

        const response = await fetch(`${API_BASE_URL}/proprietarios?${queryParams}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status} - ${response.statusText}`)
        }

        const resultado: RespostaPaginada<Proprietario> = await response.json()
        setLoading(false)
        return resultado
      } catch (error) {
        setLoading(false)
        const mensagemErro = error instanceof Error ? error.message : "Erro desconhecido ao buscar proprietários"
        setErro(mensagemErro)
        console.error("Erro ao buscar proprietários:", error)

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

  // Atualizar filtro de entidade
  const mudarFiltroEntidade = useCallback((entidadeId: string) => {
    setParametrosConsulta((prev) => ({
      ...prev,
      pagina: 1,
      filtroEntidade: entidadeId,
    }))
  }, [])

  // ===== RESULTADO DA CONSULTA =====
  const [resultadoConsulta, setResultadoConsulta] = useState<RespostaPaginada<Proprietario>>({
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
    buscarProprietarios(parametrosConsulta).then((resultado) => {
      setResultadoConsulta(resultado)
      setProprietarios(resultado.dados)
    })
  }, [parametrosConsulta, buscarProprietarios])

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
  type DadosCriacaoProprietario = {
    nome: string
    cpf: string
    telefone: string
    id_entidade: number
  }

  const criarProprietario = async (dadosProprietario: DadosCriacaoProprietario): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/proprietarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosProprietario),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao criar proprietário: ${response.status} - ${errorText}`)
      }

      // Recarregar dados
      const resultado = await buscarProprietarios(parametrosConsulta)
      setResultadoConsulta(resultado)
      setProprietarios(resultado.dados)
    } catch (error) {
      console.error("Erro ao criar proprietário:", error)
      setErro(error instanceof Error ? error.message : "Erro ao criar proprietário")
      throw error
    }
  }

  const editarProprietario = async (
    id: number,
    dadosProprietario: Partial<DadosCriacaoProprietario>,
  ): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/proprietarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosProprietario),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao editar proprietário: ${response.status} - ${errorText}`)
      }

      // Recarregar dados
      const resultado = await buscarProprietarios(parametrosConsulta)
      setResultadoConsulta(resultado)
      setProprietarios(resultado.dados)
    } catch (error) {
      console.error("Erro ao editar proprietário:", error)
      setErro(error instanceof Error ? error.message : "Erro ao editar proprietário")
      throw error
    }
  }

  const excluirProprietario = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/proprietarios/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao excluir proprietário: ${response.status} - ${errorText}`)
      }

      // Recarregar dados
      const resultado = await buscarProprietarios(parametrosConsulta)
      setResultadoConsulta(resultado)
      setProprietarios(resultado.dados)
    } catch (error) {
      console.error("Erro ao excluir proprietário:", error)
      setErro(error instanceof Error ? error.message : "Erro ao excluir proprietário")
      throw error
    }
  }

  const handleSalvarProprietario = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const dadosProprietario: DadosCriacaoProprietario = {
      nome: formData.get("nome") as string,
      cpf: formData.get("cpf") as string,
      telefone: formData.get("telefone") as string,
      id_entidade: Number.parseInt(formData.get("id_entidade") as string) || 1,
    }

    try {
      if (tipoModal === "criar") {
        await criarProprietario(dadosProprietario)
      } else if (tipoModal === "editar" && proprietarioSelecionado) {
        await editarProprietario(proprietarioSelecionado.id, dadosProprietario)
      }
      fecharModal()
    } catch (error) {
      // Erro já foi tratado nas funções acima
    }
  }

  const handleExcluir = async (): Promise<void> => {
    if (proprietarioSelecionado) {
      try {
        await excluirProprietario(proprietarioSelecionado.id)
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
        currentPage="/tabelaProprietarios"
      />

      {/********************* titulo *******************/}
      <div className="background-tabelaUsuarios">
        <div className="titulo-tabelaUsuarios">
          <h1>Tabela de Proprietários</h1>
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
              placeholder="Pesquisar por nome, CPF, telefone..."
              value={termoPesquisaInput}
              onChange={(e) => setTermoPesquisaInput(e.target.value)}
              style={{ flex: 1 }}
            />

            <button onClick={abrirModalCriar}>Adicionar Proprietário</button>
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
            <span>Total de proprietários: {resultadoConsulta.totalItens}</span>
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
                <th style={{ minWidth: "200px" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Carregando proprietários...
                  </td>
                </tr>
              ) : proprietarios.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    {parametrosConsulta.termoPesquisa
                      ? "Nenhum proprietário encontrado com os filtros aplicados"
                      : "Nenhum proprietário cadastrado"}
                  </td>
                </tr>
              ) : (
                proprietarios.map((proprietario) => (
                  <tr key={proprietario.id}>
                    <td>{proprietario.id}</td>
                    <td>{proprietario.nome}</td>
                    <td>{proprietario.cpf}</td>
                    <td>{proprietario.telefone}</td>
                    <td>
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => abrirModalVisualizar(proprietario)}
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                        >
                          Visualizar
                        </button>
                        <button
                          onClick={() => abrirModalEditar(proprietario)}
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => abrirModalExcluir(proprietario)}
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
            <h2>{tipoModal === "criar" ? "Adicionar Proprietário" : "Editar Proprietário"}</h2>

            <form onSubmit={handleSalvarProprietario}>
              <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "1fr 1fr" }}>
                <div style={{ gridColumn: "span 2" }}>
                  <label>Nome *</label>
                  <input type="text" name="nome" required defaultValue={proprietarioSelecionado?.nome || ""} />
                </div>

                <div>
                  <label>CPF *</label>
                  <input type="text" name="cpf" required defaultValue={proprietarioSelecionado?.cpf || ""} />
                </div>

                <div>
                  <label>Telefone *</label>
                  <input type="text" name="telefone" required defaultValue={proprietarioSelecionado?.telefone || ""} />
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
      {tipoModal === "excluir" && proprietarioSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div
            className="modal-conteudo"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            style={{ maxWidth: "400px" }}
          >
            <h2>Excluir Proprietário</h2>
            <p>
              Tem certeza que deseja excluir o proprietário <strong>{proprietarioSelecionado.nome}</strong>?
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
      {tipoModal === "visualizar" && proprietarioSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div
            className="modal-conteudo"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            style={{ maxWidth: "500px" }}
          >
            <h2>Detalhes do Proprietário</h2>
            <p>
              <strong>Nome:</strong> {proprietarioSelecionado.nome}
            </p>
            <p>
              <strong>CPF:</strong> {proprietarioSelecionado.cpf}
            </p>
            <p>
              <strong>Telefone:</strong> {proprietarioSelecionado.telefone}
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

export default TabelaProprietariosPage
