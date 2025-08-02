import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../app/globals.css'
import LoginPage from "../app/page"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginPage />
  </StrictMode>,
)
