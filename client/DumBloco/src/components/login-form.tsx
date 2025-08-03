import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2 } from "lucide-react"

interface LoginFormProps {
  onLoginSuccess: () => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      const resposta = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        onLoginSuccess();
      } else {
        setErro(dados.mensagem || "Erro ao fazer login.");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro na conexão com o servidor.");
    }
  }

  return (
    <Card className="w-full max-w-md bg-gray-900/90 border-gray-700 backdrop-blur-sm">
      <CardHeader className="text-center pb-8 pt-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-lg bg-gray-800/50">
            <Building2 className="h-12 w-12 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white">Login</h1>
      </CardHeader>
      <CardContent className="space-y-6 px-8 pb-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="usuario" className="text-gray-300 text-sm">
              Usuário
            </Label>
            <Input
              id="usuario"
              type="usuario"
              placeholder="Digite seu usuário aqui"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha" className="text-gray-300 text-sm">
              Senha
            </Label>
            <Input
              id="senha"
              type="password"
              placeholder="Digite sua senha aqui"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {erro && (
            <div className="text-red-500 text-sm text-center">
              {erro}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-400">
            Ainda não tem uma conta?{" "}
            <button 
              type="button"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Busque seu síndico!
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}