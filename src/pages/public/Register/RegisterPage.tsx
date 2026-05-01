import { useNavigate } from "react-router-dom";
import { register as registerRequest } from "../../../services/auth.service";
import H2Bold from "@/components/ui/H2Bold";
import CreateUserForm from "@/components/common/CreateUserForm";
import type { RegisterDTO } from "@/schemas/register.schemas";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterDTO) => {
    await registerRequest(data);
    navigate("/login", { replace: true });
  };

  return (
    <section className="relative -top-20 xl:-top-8">
      <div className="flex flex-col justify-center gap-4 text-[var(--textPrimary)] w-[95vw] md:w-[90vw] lg:w-[60vh] min-h-[25vh]">
        <div className="flex justify-center">
          <H2Bold>CRIAR CONTA</H2Bold>
        </div>

        <CreateUserForm onSuccess={handleRegister} />

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>Já tem uma conta?</span>
          <button
            type="button"
            onClick={() => navigate("/login")}
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
