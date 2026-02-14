import { useNavigate } from "react-router-dom";
import { register as registerRequest } from "../../../services/auth.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterDTO } from "@/schemas/register.schemas";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import H2Bold from "@/components/ui/H2Bold";
import { maskPhone, unmaskPhone } from "@/utils/masks";
import { useState } from "react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDTO>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const masked = maskPhone(value);
    const unmasked = unmaskPhone(masked);

    setValue("phoneNumber", unmasked, { shouldValidate: true });

    event.target.value = masked;
  };

  const handleNext = async () => {
    const currentPhone = getValues("phoneNumber");
    const cleanedPhone = unmaskPhone(currentPhone || "");

    setValue("phoneNumber", cleanedPhone);

    const isValid = await trigger(["name", "phoneNumber"]);
    if (isValid) {
      setStage(2);
    }
  };

  const onSubmit = async (data: RegisterDTO) => {
    try {
      await registerRequest(data);
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Falha ao criar conta";

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
          <div className="flex justify-center">
            <H2Bold>CRIAR CONTA</H2Bold>
          </div>

          {stage === 1 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="2xl:text-[2vh]">
                  Nome e Sobrenome
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome"
                  {...register("name")}
                />
                {errors.name && (
                  <p role="alert" className="text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
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

              <div className="flex flex-col gap-3">
                <Button type="button" onClick={handleNext}>
                  Avançar
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-[var(--textPrimary)]">
                  <span>Já tem uma conta?</span>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-bold underline cursor-pointer"
                  >
                    Entre aqui!
                  </button>
                </div>
              </div>
            </div>
          )}

          {stage === 2 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="2xl:text-[2vh]">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  {...register("password")}
                />
                {errors.password && (
                  <p role="alert" className="text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="passwordConfirmation"
                  className="2xl:text-[2vh]"
                >
                  Confirmar senha
                </label>
                <Input
                  id="passwordConfirmation"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Digite a senha novamente"
                  {...register("passwordConfirmation")}
                />
                {errors.passwordConfirmation && (
                  <p role="alert" className="text-xs text-red-600">
                    {errors.passwordConfirmation.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <Button type="submit" loading={isSubmitting}>
                  Criar conta
                </Button>
                <button
                  type="button"
                  onClick={() => setStage(1)}
                  className="text-sm text-[var(--textPrimary)] underline opacity-80"
                >
                  Voltar para dados pessoais
                </button>
              </div>
            </div>
          )}
        </div>

        {errors.root && (
          <p role="alert" className="text-red-600 text-center">
            {errors.root.message}
          </p>
        )}
      </form>
    </section>
  );
};

export default RegisterPage;
