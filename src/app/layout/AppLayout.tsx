import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Header from "@/components/ui/Header";

export const AppLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="layout layout-app">
      <Header>
        <button
          type="button"
          onClick={logout}
          className="cursor-pointer font-medium hover:opacity-80"
        >
          sair
        </button>
      </Header>
      <main className="flex flex-col" style={{ paddingTop: "1.5rem" }}>
        <nav className="flex justify-around" style={{ paddingBottom: "2rem" }}>
          <NavLink to="/app" end>
            Início
          </NavLink>
          <NavLink to="/app/agenda">Agenda</NavLink>
        </nav>
        <Outlet />
      </main>
    </div>
  );
};
