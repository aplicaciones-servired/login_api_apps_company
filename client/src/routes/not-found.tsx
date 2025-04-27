import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800'>
      <h1 className='text-6xl font-bold mb-4'>404</h1>
      <p className='text-xl mb-6'>Página no encontrada</p>
      <Button onClick={() => navigate('/')}>
        Regresar a la página principal
      </Button>
    </div>
  );
};