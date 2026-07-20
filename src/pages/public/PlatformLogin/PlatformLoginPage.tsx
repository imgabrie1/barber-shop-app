import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import api from "../../../services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginDTO } from "@/schemas/login.schemas";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import H2Bold from "@/components/ui/H2Bold";
import { maskPhone, unmaskPhone } from "@/utils/masks";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { setTokens, getTenant, USER_STORAGE } from "@/services/auth.storage";
import { storage } from "@/services/storage";

const PlatformLoginPage = () => {
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
      const cleanData = {
        ...data,
        phoneNumber: unmaskPhone(data.phoneNumber),
      };

      const response = await api.post("/platform/login", cleanData);

      const { token, refreshToken, user } = response.data;

      setTokens(token, refreshToken);
      storage.set(USER_STORAGE, JSON.stringify(user));
      login(user);

      toast.success("Bem-vindo, Super Admin!");

      const storedTenant = getTenant();
      const from =
        (location.state as { from?: string } | null)?.from
        || (storedTenant && `/t/${storedTenant}/app/platform`)
        || "/";
      navigate(from, { replace: true });
    } catch (err: unknown) {
      let message = "Falha ao fazer login na plataforma";

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
    <section className="flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-[400px]">
        <div className="mb-2 flex flex-col items-center justify-center">
          <H2Bold>ACESSO RESTRITO</H2Bold>
          <span className="text-sm text-red-500 uppercase mt-1 font-semibold">
            SUPER ADMIN
          </span>
        </div>

        <form
          className="mt-4 bg-[var(--block)] p-6 md:p-8 border border-red-200 rounded-2xl shadow-sm flex flex-col gap-6 relative overflow-hidden"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">
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
              <label className="text-sm font-semibold text-gray-600">
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

          <Button
            type="submit"
            className="w-full !bg-red-600 hover:!bg-red-700 text-white"
            loading={isSubmitting}
          >
            Entrar na Plataforma
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="underline cursor-pointer hover:text-gray-500 text-gray-400"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    </section>
  );
};

export default PlatformLoginPage;
