import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { login as loginRequest } from "../../../services/auth.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginDTO } from "@/schemas/login.schemas";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import H2Bold from "@/components/ui/H2Bold";
import { maskPhone, unmaskPhone } from "@/utils/masks";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const masked = maskPhone(value);
    const unmasked = unmaskPhone(masked);

    setValue("phoneNumber", unmasked, { shouldValidate: true });
    event.target.value = masked;
  };

  const onSubmit = async (data: LoginDTO) => {
    try {
      const response = await loginRequest(data);
      login(response.user);

      toast.success("Bem-vindo de volta!");

      const from = (location.state as { from?: string } | null)?.from || "/app";
      navigate(from, { replace: true });
    } catch (err: unknown) {
      let message = "Falha ao fazer login";

      if (err instanceof AxiosError) {
        message =
          err.response?.data?.message || err.response?.statusText || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-6 flex justify-center">
          <H2Bold>ENTRAR</H2Bold>
        </div>

        <form
          className="bg-[var(--block)] p-6 md:p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Telefone</label>
              <Input
                id="phoneNumber"
                type="tel"
                autoComplete="tel"
                placeholder="(00) 00000-0000"
                {...register("phoneNumber", {
                  onChange: handlePhoneChange,
                })}
              />

              {errors.phoneNumber && (
                <p role="alert" className="text-xs text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Senha</label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                {...register("password")}
              />
              {errors.password && (
                <p role="alert" className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Entrar
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>Não tem uma conta?</span>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-bold underline cursor-pointer hover:text-gray-500 text-gray-300"
          >
            Crie aqui!
          </button>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
