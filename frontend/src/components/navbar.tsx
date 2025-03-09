import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './theme-toggle'
import { HomeIcon } from 'lucide-react'

export const Navbar = () => {
  return (
    <div className="w-full fixed top-0 left-0 z-50 p-4 px-6 flex justify-between items-center bg-sidebar text-sidebar-foreground shadow-md border-b border-sidebar-border">
      {/* Home Icon */}
      <Link to="/" className="text-sidebar-foreground hover:text-sidebar-primary transition">
        <HomeIcon size={28} />
      </Link>

      {/* Dark/Light Theme Toggle */}
      <ThemeToggle />
    </div>
  )
}
