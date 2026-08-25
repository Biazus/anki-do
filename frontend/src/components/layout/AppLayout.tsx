import { NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link--active' : 'nav-link'

export function AppLayout() {
  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Ir para o conteúdo
      </a>
      <header className="app-header">
        <NavLink to="/" className="app-brand" aria-label="anki-do — voltar para home">
          anki-do
        </NavLink>
        <nav className="app-nav" aria-label="Navegação principal">
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
      <main id="main-content" className="app-main" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
