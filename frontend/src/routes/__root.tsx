import { Navbar } from '@/components/navbar'
import Header from '@/components/Header'
import { ThemeProvider } from '@/components/theme-provider'
import { createRootRoute, Outlet, useMatchRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

function Layout() {
  const matchRoute = useMatchRoute()
  const isCodeArea = matchRoute({ to: '/CodeArea' })

  return (
    <ThemeProvider>
      <div className="mx-auto">{isCodeArea ? <Header /> : <Navbar />}</div>
      <hr />
      <div className="mx-auto">
        <Outlet />
      </div>
    </ThemeProvider>
  )
}

export const Route = createRootRoute({ component: Layout })
