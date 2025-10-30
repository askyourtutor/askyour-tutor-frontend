import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import App from './App.tsx'
import { AuthProvider } from '../shared/contexts/AuthContext'
// Initialize security measures - must be imported to activate
import '../shared/utils/security'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
