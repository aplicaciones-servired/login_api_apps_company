import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'

import { UserI } from '@/types/User'
import axios from 'axios'
import { DialogUserCreate } from '@/components/dialog-comp'
export default function UsersPage() {
  const [user, setUser] = useState<UserI[]>([])
  const [reload, setReload] = useState(false)

  const handleReload = () => {
    setReload(!reload)
  }

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
        <DialogUserCreate reload={handleReload}/>
      </article>
      <div className='flex flex-col gap-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-left'>#</TableHead>
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
                  <TableCell className='font-medium'>{u.names}</TableCell>
                  <TableCell>{u.lastnames}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.state}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>

    </section>
  )
}