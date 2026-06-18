import { useForm, useWatch } from "react-hook-form";
import Input from "../ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createShopSchema } from "@/schemas/admin.schema";
import type { createShopType, ShopUnity } from "@/interfaces/admin.interface";
import Button from "../ui/Button";
import { useEffect } from "react";
import { useShopMutation } from "@/features/Admin/hooks/useShopMutation";

type stagesServices = "createShop" | "editShop";

interface CreateShopUnityFormProps {
  typeStage: stagesServices;
  initialData?: ShopUnity;
  onSuccess?: () => void;
}

const CreateAndEditShopUnityForm = ({
  typeStage,
  initialData,
  onSuccess,
}: CreateShopUnityFormProps) => {
  const { createMutation, updateMutation } = useShopMutation();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<createShopType>({
    resolver: zodResolver(createShopSchema),
    mode: "onChange",
    defaultValues: { ...initialData, alwaysOpen: initialData?.alwaysOpen ?? false },
  });

  const alwaysOpen = useWatch({
    control,
    name: "alwaysOpen",
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: createShopType) => {
    try {
      const payload = {
        ...data,
        businessStartHour: Number.isNaN(data.businessStartHour) ? undefined : data.businessStartHour,
        businessEndHour: Number.isNaN(data.businessEndHour) ? undefined : data.businessEndHour,
      };

      console.log("Submitting payload:", payload);

      if (typeStage === "createShop") {
        await createMutation.mutateAsync(payload);
      } else if (typeStage === "editShop" && initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, data: payload });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      console.error("Submission error:", err);
      const message =
        err instanceof Error
          ? err.message
          : `Falha ao ${typeStage === "createShop" ? "criar" : "editar"} unidade`;

      setError("root", {
        type: "manual",
        message,
      });
    }
  };

  const onInvalid = (errors: unknown) => {
    console.error("Validação falhou! Erros:", errors);
  };

  return (
    <section className="bg-[var(--block)] p-5 border rounded-md">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="2xl:text-[2vh]">
            Nome da Unidade
          </label>
          <Input
            className="bg-gray-700"
            id="name"
            type="text"
            placeholder="Ex: Unidade Central"
            {...register("name")}
          />
          {errors.name && (
            <p role="alert" className="text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="address" className="2xl:text-[2vh]">
            Endereço
          </label>
          <Input
            className="bg-gray-700"
            id="address"
            type="text"
            placeholder="Ex: Rua Principal, 123"
            {...register("address")}
          />
          {errors.address && (
            <p role="alert" className="text-xs text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="alwaysOpen"
            {...register("alwaysOpen")}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="alwaysOpen" className="2xl:text-[2vh] text-white cursor-pointer">
            Aberto 24 horas
          </label>
        </div>

        {!alwaysOpen && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="businessStartHour" className="2xl:text-[2vh]">
                Hora de Início
              </label>
              <Input
                className="bg-gray-700"
                id="businessStartHour"
                type="number"
                placeholder="Ex: 8"
                {...register("businessStartHour", { valueAsNumber: true })}
              />
              {errors.businessStartHour && (
                <p role="alert" className="text-xs text-red-600">
                  {errors.businessStartHour.message || "Número de 0 a 23"}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="businessEndHour" className="2xl:text-[2vh]">
                Hora de Término
              </label>
              <Input
                className="bg-gray-700"
                id="businessEndHour"
                type="number"
                placeholder="Ex: 18"
                {...register("businessEndHour", { valueAsNumber: true })}
              />
              {errors.businessEndHour && (
                <p role="alert" className="text-xs text-red-600">
                  {errors.businessEndHour.message || "Número de 0 a 23"}
                </p>
              )}
            </div>
          </div>
        )}

        {errors.root && (
          <p role="alert" className="text-sm text-red-600 text-center">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" loading={isSubmitting} className="w-full">
          {typeStage === "createShop" ? "Criar Unidade" : "Salvar Alterações"}
        </Button>
      </form>
    </section>
  );
};

export default CreateAndEditShopUnityForm;
