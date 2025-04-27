import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app.sidebar'
import { SiteHeader } from '@/components/site-header'
import { ThemeProvider } from '@/contexts/theme'
import { useAuth } from '@/hooks/useAuth'
import { Outlet } from 'react-router'
import LoginPage from '@/app/login'

export default function Root() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

