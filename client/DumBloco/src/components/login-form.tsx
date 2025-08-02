import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2 } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300 text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu email aqui"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300 text-sm">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="text-left">
          <button className="text-sm text-gray-400 hover:text-gray-300 transition-colors">Forgot Password?</button>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          onClick={() => console.log("Sign in clicked")}
        >
          Sign In
        </Button>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-400">
            Ainda não tem uma conta?{" "}
            <button className="text-gray-300 hover:text-white transition-colors">Busque seu sintético</button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
