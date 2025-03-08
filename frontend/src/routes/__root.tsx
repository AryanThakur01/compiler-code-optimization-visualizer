import { Navbar } from '@/components/navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <div className="container mx-auto">
        <Navbar />
      </div>
      <hr />
      <div className="container mx-auto">
        <Outlet />
        {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
      </div>
    </ThemeProvider>
  ),
})
