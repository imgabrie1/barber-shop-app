import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const TenantResolverPage = () => {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (tenantSlug) {
      navigate(`/t/${tenantSlug}/login`, { replace: true });
    } else {
      toast.error("Nenhuma barbearia especificada na URL.");
      navigate("/", { replace: true });
    }
  }, [tenantSlug, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--textPrimary)] border-t-transparent" />
        <p className="text-sm font-medium text-[var(--textSecondary)]">
          Carregando Barbearia...
        </p>
      </div>
    </div>
  );
};

export default TenantResolverPage;
