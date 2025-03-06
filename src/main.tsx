import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { GithubProvider } from './context/GithubContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GithubProvider>
      <App />
    </GithubProvider>
  </StrictMode>,
)
