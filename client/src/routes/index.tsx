import { createBrowserRouter } from 'react-router';
import { Suspense, lazy } from 'react';
import { Loading } from '@/components/ui/loading';

const Root = lazy(() => import('@/routes/root-layout'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={<Loading />}><Root /></Suspense>,
    // errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <h1>test outlet</h1>
          </Suspense>
        )
      }
    ]
  }
])