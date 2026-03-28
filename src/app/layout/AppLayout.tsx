import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { RiMenu4Line } from "@react-icons/all-files/ri/RiMenu4Line";
import { GoX } from "@react-icons/all-files/go/GoX";
import Header from "@/components/ui/Header";
import { useState } from "react";
import P from "@/components/ui/Span";

export const AppLayout = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenAndCloseMenu = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-900">
      <Header style={{ marginBottom: "1.4rem", padding: "0.8rem" }}>
        <div className="flex flex-col">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Barbearia Vortex
            </h1>
            {isOpen ? (
              <GoX
                className="cursor-pointer"
                size={25}
                onClick={handleOpenAndCloseMenu}
              />
            ) : (
              <RiMenu4Line
                className="cursor-pointer"
                size={25}
                onClick={handleOpenAndCloseMenu}
              />
            )}
          </div>
          <div
            className={`
    overflow-hidden
    transition-all duration-300 ease-in-out
    ${isOpen ? "max-h-40 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}
  `}
            style={{ marginTop: "0.5rem" }}
          >
            <nav
              className="
            flex
            justify-around
            items-center
            border-t
            border-white/10
            w-full"
              style={{ paddingTop: "0.5rem" }}
            >
              <NavLink
                to="/app"
                end
                className={({ isActive }) =>
                  `pb-2 px-2 text-sm font-medium transition-all border-b-2 ${
                    isActive
                      ? "border-[var(--textPrimary)] text-[var(--textPrimary)] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`
                }
              >
                Início
              </NavLink>

              <NavLink
                to="/app/agenda"
                className={({ isActive }) =>
                  `pb-2 px-2 text-sm font-medium transition-all border-b-2 ${
                    isActive
                      ? "border-[var(--textPrimary)] text-[var(--textPrimary)] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`
                }
              >
                Agenda
              </NavLink>
              <P onClick={logout} className="cursor-pointer">
                Sair
              </P>
            </nav>
          </div>
        </div>
      </Header>

      <main className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-4 md:p-6 w-full max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
