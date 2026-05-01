import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterDTO } from "@/schemas/register.schemas";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { maskPhone, unmaskPhone } from "@/utils/masks";
import { useState } from "react";

interface CreateUserFormProps {
  onSuccess: (data: RegisterDTO) => Promise<void>;
  defaultRole?: "barber" | "admin";
}

const CreateUserForm = ({ onSuccess, defaultRole }: CreateUserFormProps) => {
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
      const payload = defaultRole ? { ...data, role: defaultRole } : data;
      await onSuccess(payload);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha ao criar conta";
      setError("root", { type: "manual", message });
    }
  };

  return (
    <div className="bg-[var(--block)] p-6 md:p-8 border border-gray-200 rounded-2xl shadow-sm">
      <div className="mb-6 flex justify-center">
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {stage === 1 && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Nome e Sobrenome</label>
                <Input id="name" type="text" placeholder="Digite o nome" {...register("name")} />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Telefone</label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  {...register("phoneNumber", { onChange: handlePhoneChange })}
                />
                {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>}
              </div>

              <Button type="button" className="w-full mt-2" onClick={handleNext}>Avançar</Button>
            </>
          )}

          {stage === 2 && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Senha</label>
                <Input id="password" type="password" placeholder="Mínimo 6 caracteres" {...register("password")} />
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Confirmar senha</label>
                <Input id="passwordConfirmation" type="password" placeholder="Repita a senha" {...register("passwordConfirmation")} />
                {errors.passwordConfirmation && <p className="text-xs text-red-600">{errors.passwordConfirmation.message}</p>}
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <Button type="submit" className="w-full" loading={isSubmitting}>Criar conta</Button>
                <button type="button" onClick={() => setStage(1)} className="text-sm text-gray-500 hover:text-gray-800 underline">Voltar para dados pessoais</button>
              </div>
            </>
          )}
        </div>

        {errors.root && <p className="text-red-600 text-center text-sm">{errors.root.message}</p>}
      </form>
    </div>
  );
};

export default CreateUserForm;
