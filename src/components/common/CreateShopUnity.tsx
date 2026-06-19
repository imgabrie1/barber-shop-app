import { useForm, useWatch, useFieldArray } from "react-hook-form";
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

const defaultSchedules = Array.from({ length: 7 }, (_, i) => ({
  dayOfWeek: i,
  startHour: 8,
  endHour: 18,
  isOpen: i >= 1 && i <= 6,
}));

const daysOfWeekNames = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

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
    defaultValues: {
      ...initialData,
      alwaysOpen: initialData?.alwaysOpen ?? false,
      schedules: initialData?.schedules?.length ? initialData.schedules : defaultSchedules,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "schedules",
  });

  const alwaysOpen = useWatch({
    control,
    name: "alwaysOpen",
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        schedules: initialData?.schedules?.length ? initialData.schedules : defaultSchedules,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: createShopType) => {
    try {
      console.log("Submitting payload:", data);

      if (typeStage === "createShop") {
        await createMutation.mutateAsync(data);
      } else if (typeStage === "editShop" && initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
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
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg border-b pb-2">Horários de Funcionamento</h3>
            {fields.map((field, index) => {
              const dayName = daysOfWeekNames[field.dayOfWeek];
              return (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-gray-800 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`schedules.${index}.isOpen`}
                      {...register(`schedules.${index}.isOpen` as const)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`schedules.${index}.isOpen`} className="text-white font-medium cursor-pointer">
                      {dayName}
                    </label>
                    <input type="hidden" {...register(`schedules.${index}.dayOfWeek` as const, { valueAsNumber: true })} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Abre às (hora)</label>
                    <Input
                      className="bg-gray-700 h-8"
                      type="number"
                      min={0}
                      max={23}
                      {...register(`schedules.${index}.startHour` as const, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Fecha às (hora)</label>
                    <Input
                      className="bg-gray-700 h-8"
                      type="number"
                      min={0}
                      max={23}
                      {...register(`schedules.${index}.endHour` as const, { valueAsNumber: true })}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {errors.root && (
          <p role="alert" className="text-sm text-red-600 text-center">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" loading={isSubmitting} className="w-full mt-4">
          {typeStage === "createShop" ? "Criar Unidade" : "Salvar Alterações"}
        </Button>
      </form>
    </section>
  );
};

export default CreateAndEditShopUnityForm;
