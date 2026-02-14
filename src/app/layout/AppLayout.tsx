import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export const AppLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="layout layout-app">
      <header className="layout-header">
        <div>
          <h1>Painel da Barbearia</h1>
          <p>Controle de agenda e clientes.</p>
        </div>
        <nav className="layout-nav">
          <NavLink to="/app" end>
            Dashboard
          </NavLink>
          <NavLink to="/app/agenda">Agenda</NavLink>
          <button type="button" onClick={logout} className="link-button">
            Sair
          </button>
        </nav>
      </header>
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
};
