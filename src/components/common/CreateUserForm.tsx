import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterDTO, updateUserSchema, type UpdateUserDTO } from "@/schemas/register.schemas";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { maskPhone, unmaskPhone } from "@/utils/masks";
import { useState } from "react";
import { useShopUnits } from "@/features/barberServices/hooks/useShopUnits";


interface CreateUserFormProps<T> {
  onSuccess: (data: T) => Promise<void>;
  defaultRole?: "barber" | "admin" | "manager";
  isEdit?: boolean;
  defaultValues?: Partial<UpdateUserDTO>;
}

const CreateUserForm = <T,>({ onSuccess, defaultRole, isEdit, defaultValues }: CreateUserFormProps<T>) => {
  const [stage, setStage] = useState<1 | 2>(1);
  const { data: shops } = useShopUnits(
    defaultRole === "barber" || defaultRole === "manager",
  );

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDTO>({
    resolver: zodResolver(isEdit ? updateUserSchema : registerSchema) as unknown as Resolver<RegisterDTO>,
    mode: "onChange",
    defaultValues: defaultValues,
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

    const fieldsToValidate: (keyof RegisterDTO)[] = ["name", "phoneNumber"];

    if (defaultRole === "barber" || defaultRole === "manager") {
      fieldsToValidate.push("shopId");
    }

    if (defaultRole === "barber") {
      fieldsToValidate.push("commissionPercentage");
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStage(2);
    }
  };

  const onSubmit = async (data: RegisterDTO) => {
    try {
      if (defaultRole === "barber" && !data.shopId) {
        setError("shopId", {
          type: "manual",
          message: "Selecione uma unidade",
        });
        return;
      }
      const payload = defaultRole ? { ...data, role: defaultRole } : data;
      await onSuccess(payload as unknown as T);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Falha ao criar conta";
      setError("root", { type: "manual", message });
    }
  };

  return (
    <div className="bg-[var(--block)] p-6 md:p-8 border border-gray-200 rounded-2xl shadow-sm">
      <div className="mb-6 flex justify-center"></div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {stage === 1 && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">
                  Nome e Sobrenome
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite o nome"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">
                  Telefone
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  {...register("phoneNumber", { onChange: handlePhoneChange })}
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {(defaultRole === "barber" || defaultRole === "manager") && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">
                    Unidade
                  </label>
                  <select
                    {...register("shopId")}
                    className="rounded-md bg-[var(--inputColor)] h-[6vh] 2xl:h-[5vh] lg:h-[7vh] border border-[var(--inputColor)] px-3 text-[var(--textPrimary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione uma unidade</option>
                    {shops?.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                  {errors.shopId && (
                    <p className="text-xs text-red-600">
                      {errors.shopId.message}
                    </p>
                  )}
                </div>
              )}

              {defaultRole === "barber" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">
                    Porcentagem de Comissão (%)
                  </label>
                  <Input
                    id="commissionPercentage"
                    type="number"
                    placeholder="Ex: 50"
                    {...register("commissionPercentage", {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.commissionPercentage && (
                    <p className="text-xs text-red-600">
                      {errors.commissionPercentage.message}
                    </p>
                  )}
                </div>
              )}

              {isEdit ? (
                <Button
                  type="submit"
                  className="w-full mt-2"
                  loading={isSubmitting}
                >
                  Salvar
                </Button>
              ) : (
                <Button
                  type="button"
                  className="w-full mt-2"
                  onClick={handleNext}
                >
                  Avançar
                </Button>
              )}
            </>
          )}

          {stage === 2 && !isEdit && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">
                  Confirmar senha
                </label>
                <Input
                  id="passwordConfirmation"
                  type="password"
                  placeholder="Repita a senha"
                  {...register("passwordConfirmation")}
                />
                {errors.passwordConfirmation && (
                  <p className="text-xs text-red-600">
                    {errors.passwordConfirmation.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <Button type="submit" className="w-full" loading={isSubmitting}>
                  Criar conta
                </Button>
                <button
                  type="button"
                  onClick={() => setStage(1)}
                  className="text-sm text-gray-500 hover:text-gray-800 underline"
                >
                  Voltar para dados pessoais
                </button>
              </div>
            </>
          )}
        </div>

        {errors.root && (
          <p className="text-red-600 text-center text-sm">
            {errors.root.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateUserForm;
