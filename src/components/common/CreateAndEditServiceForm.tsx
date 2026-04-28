import { useForm } from "react-hook-form";
import Input from "../ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServiceSchema } from "@/schemas/admin.schema";
import type { createServiceType } from "@/interfaces/admin.interface";
import {
  createBarberServiceService,
  updateBarberServiceService,
} from "@/features/Admin/services/admin.service";
import Button from "../ui/Button";
import type { BarberService } from "@/interfaces/barber.interface";
import { useEffect } from "react";

type stagesServices = "create" | "edit";

interface CreateAndEditServiceFormProps {
  typeStage: stagesServices;
  initialData?: BarberService;
  onSuccess?: () => void;
}

const CreateAndEditServiceForm = ({
  typeStage,
  initialData,
  onSuccess,
}: CreateAndEditServiceFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<createServiceType>({
    resolver: zodResolver(createServiceSchema),
    mode: "onChange",
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: createServiceType) => {
    try {
      if (typeStage === "create") {
        await createBarberServiceService(data);
      } else if (typeStage === "edit" && initialData?.id) {
        await updateBarberServiceService(initialData.id, data);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : `Falha ao ${typeStage === "create" ? "criar" : "editar"} serviço`;

      setError("root", {
        type: "manual",
        message,
      });
    }
  };

  return (
    <section
      style={{ padding: "20px" }}
      className="bg-[var(--block)] border rounded-md"
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="2xl:text-[2vh]">
            Nome do Serviço
          </label>
          <Input
            className="bg-gray-700"
            id="name"
            type="text"
            placeholder="Digite o nome do serviço"
            {...register("name")}
          />
          {errors.name && (
            <p role="alert" className="text-xs text-red-600">
              {errors.name.message || "Nome obrigatório"}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="durationMinutes" className="2xl:text-[2vh]">
            Duração do serviço (em minutos)
          </label>
          <Input
            className="bg-gray-700"
            id="durationMinutes"
            type="number"
            placeholder="Digite em minutos"
            {...register("durationMinutes", { valueAsNumber: true })}
          />
          {errors.durationMinutes && (
            <p role="alert" className="text-xs text-red-600">
              {errors.durationMinutes.message ||
                "Duração precisa ser um número positivo"}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="price" className="2xl:text-[2vh]">
            Preço
          </label>
          <Input
            className="bg-gray-700"
            id="price"
            type="number"
            step="0.01"
            placeholder="Ex: 10.50"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p role="alert" className="text-xs text-red-600">
              {errors.price.message || "Preço precisa ser um número positivo"}
            </p>
          )}
        </div>

        {errors.root && (
          <p role="alert" className="text-sm text-red-600 text-center">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" loading={isSubmitting} className="w-full">
          {typeStage === "create" ? "Criar" : "Salvar Alterações"}
        </Button>
      </form>
    </section>
  );
};

export default CreateAndEditServiceForm;
