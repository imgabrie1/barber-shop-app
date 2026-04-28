import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { RiMenu4Line } from "@react-icons/all-files/ri/RiMenu4Line";
import { GoX } from "@react-icons/all-files/go/GoX";
import Header from "@/components/ui/Header";
import { useState } from "react";

export const AppLayout = () => {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenAndCloseMenu = () => {
    setIsOpen(!isOpen);
  };

  const isAdmin = user?.role === "admin";
  const isBarber = user?.role === "barber";

  return (
    <div
      style={{ transition: "background-color 0.3s ease" }}
      className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A]"
    >
      <Header className="">
        <div className="flex flex-col">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              {import.meta.env.VITE_BARBER_SHOP_NAME}
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
    ${isOpen ? "max-h-64 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}
  `}
            style={{ marginTop: "0.5rem" }}
          >
            <nav
              className="
            flex
            justify-center
            items-center
            border-t
            border-white/10
            w-full
            gap-8
            "
              style={{ paddingTop: "0.625rem" }}
            >
              <NavLink
                to="/app"
                end
                className={({ isActive }) =>
                  `text-sm font-medium transition-all border-b-2 ${
                    isActive
                      ? "border-[var(--textPrimary)] text-[var(--textPrimary)] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`
                }
              >
                INICIO
              </NavLink>

              <NavLink
                to="/app/appointments"
                className={({ isActive }) =>
                  ` text-sm font-medium transition-all border-b-2 ${
                    isActive
                      ? "border-[var(--textPrimary)] text-[var(--textPrimary)] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`
                }
              >
                AGENDA
              </NavLink>

              {isBarber && (
                <NavLink
                  to="/app/barber"
                  className={({ isActive }) =>
                    ` text-sm font-medium transition-all border-b-2 ${
                      isActive
                        ? "border-[var(--textPrimary)] text-[var(--textPrimary)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`
                  }
                >
                  BARBEIRO
                </NavLink>
              )}

              {isAdmin && (
                <NavLink
                  to="/app/admin"
                  className={({ isActive }) =>
                    ` text-sm font-medium transition-all border-b-2 ${
                      isActive
                        ? "border-[var(--textPrimary)] text-[var(--textPrimary)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`
                  }
                >
                  ADMIN
                </NavLink>
              )}

              <p
                onClick={logout}
                className="text-md font-medium cursor-pointer"
              >
                SAIR
              </p>
            </nav>
          </div>
        </div>
      </Header>

      <main className="flex flex-col flex-1 overflow-hidden items-center">
        <div
          className="flex-1 overflow-auto w-full max-w-5xl xl:max-w-7xl 2xl:max-w-[100rem] mx-auto"
          style={{ padding: "1rem" }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};
