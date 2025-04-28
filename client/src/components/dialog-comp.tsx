import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Loading } from '@/components/ui/loading';
import { lazy, Suspense, useState } from 'react';
import { PlusIcon } from 'lucide-react';

const LazyDialogContent = lazy(() => import('@/components/dialog-content'));

export const DialogUserCreate = ({ reload }: { reload: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (openDialog: boolean) => {
    setIsOpen(openDialog)
  }

  return (
    <Dialog onOpenChange={v => handleOpenChange(v)} open={isOpen}>
      <DialogTrigger>
        <PlusIcon className="size-4" />
        Crear Nuevo Usuario
      </DialogTrigger>
      {isOpen && (
        <Suspense fallback={<Loading />}>
          <LazyDialogContent funClose={handleOpenChange} reload={reload}/>
        </Suspense>
      )}
    </Dialog>
  );
};