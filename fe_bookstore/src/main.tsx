import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ErrorProvider } from './context/ErrorContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

import App from './App.tsx'

import './main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorProvider>
  </StrictMode>,
)
