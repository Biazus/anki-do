import { NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link--active' : 'nav-link'

export function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <NavLink to="/" className="app-brand">
          anki-do
        </NavLink>
        <nav className="app-nav">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/topics" className={navLinkClass}>
            Tópicos
          </NavLink>
          <NavLink to="/cards/new" className={navLinkClass}>
            Novo Card
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
