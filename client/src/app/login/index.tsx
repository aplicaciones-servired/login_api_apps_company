import { LockIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import axios from 'axios';


export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const { login } = useAuth()

  const [loading, setLoading] = useState(false)

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    setLoading(true);

    axios.post('/login', { username, password })
      .then(res => res.status === 200 ? login() : null)
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  return (
    <section className="w-screen h-screen flex bg-gradient-to-b">
      <figure className='w-full'>
        <img src="logo.webp" alt="logo para cartera" className='h-full' loading='lazy' />
      </figure>

      <section className='w-full grid place-content-center bg-slate-50'>
        <form className='min-w-96 flex flex-col gap-8' onSubmit={handleSubmit}>
          <figure className='flex items-center justify-center'>
            <img src="/gane.webp" alt="logo de gane" className='w-[220px] ' loading='lazy' />
          </figure>
          <article className='flex flex-col gap-1 text-md lg:text-lg 2xl:text-2xl'>
            <Label>Usuario: </Label>
            <div className='flex items-center gap-2 w-full justify-around px-2'>
              <UserIcon />
              <Input name='username' type='text' placeholder='CP1118342523' required
                autoComplete='username' value={username} onChange={(ev) => { setUsername(ev.target.value) }} />
            </div>
          </article>

          <article className='flex flex-col gap-1 text-md lg:text-lg 2xl:text-2xl'>
            <Label>Contraseña:</Label>
            <div className='flex items-center gap-2 w-full justify-around px-2'>
              <LockIcon />
              <Input name='contraseña' type='password' placeholder='***********' required
                autoComplete='contraseña' value={password} onChange={(ev) => { setPassword(ev.target.value) }} />
            </div>
          </article>

          <Button
            disabled={loading}
            type='submit'
          >
            {
              loading ? <div className='flex items-center justify-center gap-2'>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"></path>
                </svg>
                Iniciando ...</div> : 'Iniciar Sesion'
            }
          </Button>

        </form >

        {/* section to restore password */}
        <section className='flex justify-center items-center pt-4'>
          <a
            href="https://admin-users.aplicacionesgane.cloud/reset-password"
            className='text-sm lg:text-md 2xl:text-lg hover:text-blue-600'
            target="_blank"
            rel="noopener noreferrer"
          >
            Olvidaste tu contraseña?
          </a>
        </section>
      </section>

    </section >
  )
};