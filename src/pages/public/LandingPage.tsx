import { useState } from "react";
import Button from "@/components/ui/Button";
import H2Bold from "@/components/ui/H2Bold";
import PsemiBold from "@/components/ui/PsemiBold";
import Input from "@/components/ui/Input";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const LandingPage = () => {
  const navigate = useNavigate();
  const [tenantInput, setTenantInput] = useState("");

  const handleEnterTenant = () => {
    if (!tenantInput.trim()) {
      toast.error("Por favor, digite o código da barbearia.");
      return;
    }
    const slug = tenantInput.trim().toLowerCase();
    navigate(`/t/${slug}`);
  };

  return (
    <section className="flex flex-col gap-6 items-center justify-center w-full max-w-md mx-auto p-4 min-h-screen">
      <div className="flex flex-col gap-2 text-center">
        <H2Bold>Bem-vindo à Plataforma</H2Bold>
        <PsemiBold>Identifique a sua barbearia para continuar.</PsemiBold>
      </div>

      <div className="flex flex-col w-full gap-4 mt-4 bg-[var(--block)] p-6 border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">Código da Barbearia</label>
          <Input
            placeholder="Ex: barbearia-vortex"
            value={tenantInput}
            onChange={(e) => setTenantInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEnterTenant()}
          />
        </div>
        <Button type="button" onClick={handleEnterTenant}>
          Acessar
        </Button>
      </div>
    </section>
  );
};
