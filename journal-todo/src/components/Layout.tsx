import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookIcon, CheckSquareIcon, FeatherIcon } from './Icons'
import ThemeToggle from './ThemeToggle'
import UndoToast from './journal/UndoToast'

const links = [
  { to: '/journal', label: 'Journal', icon: BookIcon },
  { to: '/todo', label: 'Todo', icon: CheckSquareIcon },
]

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <NavLink to="/journal" className="brand">
            <span className="brand-mark">
              <FeatherIcon width={16} height={16} />
            </span>
            <span className="brand-name">Notebook</span>
          </NavLink>
          <nav className="nav" aria-label="Main">
            {links.map(({ to, label, icon: LinkIcon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <LinkIcon width={16} height={16} />
                {label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main className="app">
        <Outlet />
      </main>
      <UndoToast />
    </>
  )
}
