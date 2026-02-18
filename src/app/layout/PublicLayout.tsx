import Header from "@/components/ui/Header";
import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
};
