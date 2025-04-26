import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css'
import { Button } from './components/ui/button'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <section className='m-2'>
      <h1>Hello World</h1>
      <Button variant={'default'} size={'lg'}>
        Test
      </Button>
    </section>
  </StrictMode>,
)
