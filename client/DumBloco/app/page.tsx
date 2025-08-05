import { LoginForm } from "../src/components/login-form"

interface LoginPageProps {
  onLoginSuccess: () => void
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  )
}
