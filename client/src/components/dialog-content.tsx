import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { OptionsCreation } from '@/types/Interfaces';
import { DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

function LazyDialogContent({ funClose, reload } : { funClose: (openDialog: boolean) => void, reload: () => void }) {
  const { user } = useAuth()
  const [options, setOptions] = useState<OptionsCreation | null>(null)

  const [formData, setFormData] = useState({
    names: '',
    lastNames: '',
    document: '',
    phone: '',
    email: '',
    company: '',
    process: '',
    sub_process: '',
    documentCreator: user?.document
  });

  const handleChange = (key: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios.post('/register', formData)
     .then(res => {
        console.log(res.data);
        setFormData({
          names: '',
          lastNames: '',
          document: '',
          phone: '',
          email: '',
          company: '',
          process: '',
          sub_process: '',
          documentCreator: user?.document
        });
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
          <Label htmlFor='names'>Nombres</Label>
          <Input
            id='names'
            type='text'
            className='col-span-2'
            placeholder='Valeria Daniela'
            onChange={(e) => handleChange('names', e.target.value)}
            value={formData.names}
          />

          <Label htmlFor='lastNames'>Apellidos</Label>
          <Input
            id='lastNames'
            type='text'
            className='col-span-2'
            placeholder='Perez Muños'
            onChange={e => handleChange('lastNames', e.target.value)}
            value={formData.lastNames}
          />

          <Label htmlFor='document'>N° Documento</Label>
          <Input
            type='text'
            id='document'
            className='col-span-2'
            placeholder='1118245****'
            onChange={e => handleChange('document', e.target.value)}
            value={formData.document}
          />

          <Label htmlFor='phone'>N° Telefono</Label>
          <Input
            id='phone'
            type='text'
            className='col-span-2'
            placeholder='320 245 67 ** **'
            onChange={e => handleChange('phone', e.target.value)}
            value={formData.phone}
          />

          <Label htmlFor='email'>Correo</Label>
          <Input
            id='email'
            type='text'
            className='col-span-2'
            placeholder='example@gmail.com '
            onChange={e => handleChange('email', e.target.value)}
            value={formData.email}
          />

          <Label>Empresa</Label>
          <div className='col-span-2'>
            <Select onValueChange={(value) => handleChange('company', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona empresa" />
              </SelectTrigger>
              <SelectContent id='company'>
                {options?.company.map((item) => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label.replace('Y', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Label>Proceso</Label>
          <div className='col-span-2'>
            <Select onValueChange={(value) => handleChange('process', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona proceso" />
              </SelectTrigger>
              <SelectContent>
                {options?.process.map((item) => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Label>Cargo</Label>
          <div className='col-span-2'>
            <Select onValueChange={(value) => handleChange('sub_process', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona cargo" />
              </SelectTrigger>
              <SelectContent>
                {options?.sub_process.map((item) => (
                  <SelectItem key={item.value} value={item.value.toString()} className='capitalize'>
                    {item.label.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type='submit' className=''>
            Crear Usuario
          </Button>
        </form>
      </section>
    </DialogContent>
  )
}

export default LazyDialogContent;
