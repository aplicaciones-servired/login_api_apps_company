import { createBrowserRouter } from 'react-router';
import { Loading } from '@/components/ui/loading';
import { Suspense, lazy } from 'react';

const NotFound = lazy(() => import('@/routes/not-found'));
const Root = lazy(() => import('@/routes/root-layout'));
const Dashboard = lazy(() => import('@/app/dashboard'))
const UserPage = lazy(() => import('@/app/users'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={<Loading />}><Root /></Suspense>,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        )
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<Loading />}>
            <UserPage />
          </Suspense>
        )
      }
    ]
  }
])