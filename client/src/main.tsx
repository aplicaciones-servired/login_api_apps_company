import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { StrictMode } from 'react'
import axios from 'axios'
import './index.css'

import { router } from '@/routes'
import { AuthProvider } from './auth'
import { Toaster } from 'sonner'

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        closeButton={true}
        duration={5000}
        richColors
      />
    </AuthProvider>
  </StrictMode>,
)
