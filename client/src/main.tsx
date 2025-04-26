import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css'

import Dashboard from '@/app/dashboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Dashboard />
  </StrictMode>,
)
