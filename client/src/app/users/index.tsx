import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { DialogUserCreate } from '@/components/dialog-comp';
import { useEffect, useState } from 'react';

import { EllipsisVertical } from 'lucide-react';
import { UserI } from '@/types/User';
import { toast } from 'sonner';
import axios from 'axios';

export default function UsersPage() {
  const [user, setUser] = useState<UserI[]>([])
  const [reload, setReload] = useState(false)

  const handleReload = () => {
    setReload(!reload)
  }

  const handleInactivar = (id: string, newState: string) => {
    axios.post('/changestate', { id, newState })
      .then(res => {
        if (res.status === 200) {
          setReload(!reload)
          toast.success(`Usuario se cambia estado a: ${newState === '1' ? 'Activo' : 'Inactivo'}`, {
            description: `Modificado con numero de documento: ${res.data.document}`
          })
        }
      }
      )
      .catch(err => {
        console.log(err);
        toast.error('No se pudo modificar el estado del usuario')
      })
  }

  const handleToggleState = (id: string, currentState: string) => {
    handleInactivar(id, currentState === 'Activo' ? '0' : '1');
  };

  useEffect(() => {
    axios.get('/users')
      .then(res => {
        console.log(res.data);
        setUser(res.data)
      })
      .catch(err => {
        console.error(err);
      })
  }, [reload])

  return (
    <section className=''>
      <article className='px-4 py-2 flex justify-between '>
        <p className='text-muted-foreground'>Lista de usuarios registrados en el sistema.</p>
        <DialogUserCreate reload={handleReload} />
      </article>
      <div className='flex flex-col gap-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-left'>#</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Nombres</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              user.map((u, i) => (
                <TableRow key={u.id}>
                  <TableCell className='text-muted-foreground'>{i + 1}</TableCell>
                  <TableCell>{u.document}</TableCell>
                  <TableCell className='font-medium'>{u.names}</TableCell>
                  <TableCell>{u.lastnames}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={`${u.state! === 'Activo' ? 'succes' : 'danger'}`}>{u.state}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Ver detallado</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleState(u.id, u.state)}
                          className={`${u.state === 'Activo' ? 'text-red-400 ' : 'text-green-400'} hover:font-semibold`}>
                          {u.state === 'Activo' ? 'Inactivar' : 'Activar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>Borrar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>

    </section>
  )
}