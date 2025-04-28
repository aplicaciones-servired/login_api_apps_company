import { DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useEffect, useState, FormEvent } from 'react';
import { OptionsCreation } from '@/types/Interfaces';
import { toast } from 'sonner';
import axios from 'axios';

function LazyDialogContent({ funClose, reload }: { funClose: (openDialog: boolean) => void, reload: () => void }) {
  const [options, setOptions] = useState<OptionsCreation | null>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = Object.fromEntries(new window.FormData(e.currentTarget));

    axios.post('/register', formData)
      .then(res => {
        console.log(res.data);
        funClose(false)
        reload()
        toast.success('Usuario creado correctamente', { description: 'agregado a lista de usuarios registrados' })
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 400) {
          toast.error(err.response.data.message)
        } else {
          toast.error('Error inesperado :O')
        }
      })
  }

  useEffect(() => {
    axios.get('/newUserOptions')
      .then(res => setOptions(res.data))
      .catch(err => console.log(err))
  }, [])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Creación nuevo usuario</DialogTitle>
        <DialogDescription>
          Debes diligenciar todos los campos para crear un nuevo usuario.
        </DialogDescription>
      </DialogHeader>
      <section>

        <form className='grid grid-cols-3 gap-4' onSubmit={handleSubmit}>
          <Label htmlFor='names_'>Nombres</Label>
          <Input
            id='names_'
            name='names'
            type='text'
            className='col-span-2'
            placeholder='Valeria Daniela'
          />

          <Label htmlFor='lastNames_'>Apellidos</Label>
          <Input
            id='lastNames_'
            name='lastNames'
            type='text'
            className='col-span-2'
            placeholder='Perez Muños'
          />

          <Label htmlFor='document_'>N° Documento</Label>
          <Input
            id='document_'
            type='text'
            name='document'
            className='col-span-2'
            placeholder='1118245****'
          />

          <Label htmlFor='phone_'>N° Telefono</Label>
          <Input
            id='phone_'
            type='text'
            name='phone'
            className='col-span-2'
            placeholder='320 245 67 ** **'
          />

          <Label htmlFor='email_'>Correo</Label>
          <Input
            id='email_'
            type='text'
            name='email'
            className='col-span-2'
            placeholder='example@gmail.com '
          />

          <Label htmlFor='company_'>Empresa</Label>
          <select
            id='company_'
            name='company'
            className='border rounded-md px-2 py-1 cursor-pointer col-span-2'
          >
            <option value="">Seleccionar Empresa</option>
            {
              options?.company.map(opt => (
                <option value={opt.value} key={opt.value}>
                  {opt.label.replace('Y', ' ')}
                </option>
              ))
            }
          </select>

          <Label htmlFor='process_'>Proceso</Label>
          <select
            id='process_'
            name='process'
            className='border rounded-md px-2 py-1 cursor-pointer col-span-2'
          >
            <option value="">Seleccionar Proceso</option>

            {options?.process.map((item) => (
              <option key={item.value} value={item.value.toString()}>
                {item.label.replace('_', ' ')}
              </option>
            ))}
          </select>

          <Label htmlFor='sub_process_'>Cargo</Label>

          <select
            id='sub_process_'
            name='sub_process'
            className='border rounded-md px-2 py-1 cursor-pointer col-span-2'
          >
            <option value="">Seleccionar Cargo</option>
            {options?.sub_process.map((item) => (
              <option key={item.value} value={item.value.toString()} className='capitalize'>
                {item.label.replace('_', ' ')}
              </option>
            ))}
          </select>

          <Button type='submit'>
            Crear Usuario
          </Button>
        </form>
      </section>
    </DialogContent>
  )
}

export default LazyDialogContent;
