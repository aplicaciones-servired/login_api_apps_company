import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app.sidebar'
import { SiteHeader } from '@/components/site-header'
import { useAuth } from '@/hooks/useAuth'
import { Outlet } from 'react-router'
import LoginPage from '@/app/login'

export default function Root() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

