import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="layout layout-public">
      <header className="layout-header">
        <h1>Barbearia Genérica</h1>
        <p>Agendamentos online.</p>
      </header>
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}
