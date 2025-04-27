import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'

import { UserI } from '@/types/User'
import axios from 'axios'

export default function UsersPage() {
  const [user, setUser] = useState<UserI[]>([])

  useEffect(() => {
    axios.get('/users')
      .then(res => {
        console.log(res.data);
        setUser(res.data)
      })
      .catch(err => {
        console.error(err);
      })
  }, [])

  return (
    <div className=''>
      <div className='flex flex-col gap-2'>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='text-left'>#</TableHead>
              <TableHead>Nombres</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Estado</TableHead>
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

    </div>
  )
}