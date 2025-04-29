import { LockIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const { login } = useAuth()

  const [loading, setLoading] = useState(false)

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    setLoading(true);

    toast.promise(
      axios.post('/login', { username, password }),
      {
        loading: 'Iniciando sesión...',
        success: (data) => {
          if (data.status === 200) {
            login()
            return 'Bienvenido de nuevo!';
          }
          throw new Error("Error inesperado");
        },
        error: (err) => {
          console.log(err);
          return 'Error al iniciar sesión. Verifica tus credenciales.';
        },
        finally: () => {
          setLoading(false)
        }
      }
    )
  }

  return (
    <section className="w-screen h-screen flex bg-gradient-to-b">
      <figure className='w-full flex items-center justify-center'>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div></div>
        <img src="userimage.png" alt="logo para cartera" className='' loading='lazy' />
      </figure>

      <section className='w-full grid place-content-center bg-slate-50'>
        <form className='min-w-96 flex flex-col gap-8' onSubmit={handleSubmit}>
          <figure className='flex items-center justify-center'>
            <img src="logogane.webp" alt="logo de gane" className='w-[220px] ' loading='lazy' />
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
            Iniciar Sesion
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