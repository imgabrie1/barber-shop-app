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
    <section className="relative -top-20 xl:-top-8">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center gap-4 text-[var(--textPrimary)] w-[95vw] md:w-[90vw] lg:w-[60vh] min-h-[25vh]">
          <div className="flex justify-center">
            <H2Bold>ENTRAR</H2Bold>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phoneNumber" className="2xl:text-[2vh]">
              Telefone
            </label>
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
            <label htmlFor="password" className="2xl:text-[2vh]">
              Senha
            </label>
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

        <div className="flex flex-col gap-3">
          <Button type="submit" loading={isSubmitting}>
            Entrar
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-[var(--textPrimary)]">
            <span>Não tem uma conta?</span>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-bold underline cursor-pointer"
            >
              Crie aqui!
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;
