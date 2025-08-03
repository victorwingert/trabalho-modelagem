import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../app/globals.css'
import LoginPage from "../app/page"
import DashboardPage from "../app/dashboard/page"

function MainApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  return (
    <StrictMode>
      {isLoggedIn ? (
        <DashboardPage />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<MainApp />)