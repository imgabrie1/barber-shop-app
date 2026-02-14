import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--headerColor)] w-full flex justify-center">
        <div
          className="w-[95vw] md:w-[90vw] lg:w-[130vh] text-[var(--textPrimary)] px-2 flex flex-col 2xl:gap-4 gap-2"
          style={{ paddingTop: "0.9rem", paddingBottom: "0.9rem" }}
        >
          <h1 className="text-xl font-bold 2xl:text-2xl ">
            Barbearia Vortex
          </h1>
        </div>
      </header>
      <main className="flex-1 flex justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
};
