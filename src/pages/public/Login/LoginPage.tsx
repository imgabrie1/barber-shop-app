import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { login as loginRequest } from "../../../services/auth.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginDTO } from "@/schemas/login.schemas";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDTO) => {
    try {
      await loginRequest(data);
      login();

      const from = (location.state as { from?: string } | null)?.from || "/app";

      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Falha ao fazer login";

      setError("root", {
        type: "manual",
        message,
      });
    }
  };

  return (
    <section className="relative -top-20 xl:-top-8">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center gap-4 text-[var(--textPrimary)] w-[95vw] md:w-[90vw] lg:w-[60vh] min-h-[25vh]">
          <div className="flex flex-col gap-2">
            <label htmlFor="phoneNumber" className="2xl:text-[2vh]">Telefone</label>
            <Input
              id="phoneNumber"
              type="tel"
              autoComplete="tel"
              {...register("phoneNumber")}
            />

            {errors.phoneNumber && (
              <p role="alert" className="text-xs text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="2xl:text-[2vh]">Senha</label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p role="alert" className="text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {errors.root && <p role="alert">{errors.root.message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </section>
  );
};
