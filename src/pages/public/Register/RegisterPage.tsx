import { useNavigate, useParams, Navigate } from "react-router-dom";
import { register as registerRequest } from "../../../services/auth.service";
import H2Bold from "@/components/ui/H2Bold";
import CreateUserForm from "@/components/common/CreateUserForm";
import type { RegisterDTO } from "@/schemas/register.schemas";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

  if (!tenantSlug) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async (data: RegisterDTO & { role?: string }) => {
    await registerRequest(data);
    navigate(`/t/${tenantSlug}/login`, { replace: true });
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-2 flex flex-col items-center justify-center">
          <H2Bold>CRIAR CONTA</H2Bold>
          <span className="text-sm text-gray-500 uppercase mt-1 font-semibold">{tenantSlug}</span>
        </div>

        <CreateUserForm onSuccess={handleRegister} />

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>Já tem uma conta?</span>
          <button
            type="button"
            onClick={() => navigate(`/t/${tenantSlug}/login`)}
            className="font-bold underline cursor-pointer hover:text-gray-500 text-gray-300"
          >
            Entre aqui!
          </button>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
