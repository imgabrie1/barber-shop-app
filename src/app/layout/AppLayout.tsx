import { NavLink, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { RiMenu4Line } from "@react-icons/all-files/ri/RiMenu4Line";
import { GoX } from "@react-icons/all-files/go/GoX";
import Header from "@/components/ui/Header";
import { useState } from "react";
import { MdLogout } from "react-icons/md";

export const AppLayout = () => {
  const { logout, user } = useAuth();
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleOpenAndCloseMenu = () => {
    setIsOpen(!isOpen);
  };

  const isAdmin = user?.role === "admin";
  const isBarber = user?.role === "barber";
  const isManager = user?.role === "manager";
  const isClient = user?.role === "client";
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div
      style={{
        background: "var(--background)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
      className="flex flex-col min-h-screen"
    >
      <Header className="">
        <div className="flex flex-col">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight uppercase">
{user?.tenant?.name || tenantSlug}
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
              {!isSuperAdmin && (
                <NavLink
                  to={`/t/${tenantSlug}/app`}
                  end
                  className={({ isActive }) =>
                    `text-sm font-medium transition-all border-b-2 ${
                      isActive
                        ? "border-[var(--textHeader)] text-[var(--textHeader)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`
                  }
                >
                  INICIO
                </NavLink>
              )}

              {!isSuperAdmin && (
                <NavLink
                  to={`/t/${tenantSlug}/app/appointments`}
                  className={({ isActive }) =>
                    ` text-sm font-medium transition-all border-b-2 ${
                      isActive
                        ? "border-[var(--textHeader)] text-[var(--textHeader)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`
                  }
                >
                  AGENDA
                </NavLink>
              )}

              {isBarber && (
                <NavLink
                  to={`/t/${tenantSlug}/app/barber`}
                  className={({ isActive }) =>
                    ` text-sm font-medium transition-all border-b-2 ${
                      isActive
                        ? "border-[var(--textHeader)] text-[var(--textHeader)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`
                  }
                >
                  BARBEIRO
                </NavLink>
              )}

              {isAdmin && (
                <NavLink
                  to={`/t/${tenantSlug}/app/admin`}
                  className={({ isActive }) =>
                    ` text-sm font-medium transition-all border-b-2 ${
                      isActive
                        ? "border-[var(--textHeader)] text-[var(--textHeader)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`
                  }
                >
                  ADMIN
                </NavLink>
              )}

              {isSuperAdmin && (
                <NavLink
                  to={`/t/${tenantSlug}/app/platform`}
                  className={({ isActive }) =>
                    ` text-sm font-medium transition-all border-b-2 ${
                      isActive
                        ? "border-[var(--textHeader)] text-[var(--textHeader)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`
                  }
                >
                  PLATAFORMA
                </NavLink>
              )}

              {isManager && (
                <NavLink
                  to={`/t/${tenantSlug}/app/manager`}
                  className={({ isActive }) =>
                    ` text-sm font-medium transition-all border-b-2 ${
                      isActive
                        ? "border-[var(--textHeader)] text-[var(--textHeader)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`
                  }
                >
                  GERENTE
                </NavLink>
              )}
              {isClient && (
                <NavLink
                  to={`/t/${tenantSlug}/app/clientProfile`}
                  className={({ isActive }) =>
                    ` text-sm font-medium transition-all border-b-2 ${
                      isActive
                        ? "border-[var(--textHeader)] text-[var(--textHeader)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`
                  }
                >
                  PERFIL
                </NavLink>
              )}

              <p
                onClick={logout}
                className="text-md font-medium cursor-pointer"
              >
                <MdLogout size={24} />
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
