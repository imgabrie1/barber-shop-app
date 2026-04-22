import H2Bold from "@/components/ui/H2Bold";
import { useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { LuPencil, LuTrash2, LuArrowLeft } from "react-icons/lu";
import { useServices } from "@/features/barberServices/hooks/useBarbersServices";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import { formatCurrency } from "@/utils/masks";
import { useQueryClient } from "@tanstack/react-query";
import { deleteBarberServiceService } from "@/features/Admin/services/admin.service";
import ConfirmModal from "@/components/common/ConfirmModal";
import type { BarberService } from "@/interfaces/barber.interface";
import CreateAndEditServiceForm from "@/components/common/CreateAndEditServiceForm";

type stagesServices = "init" | "create" | "edit" | "delete";

const AdminServicesPage = () => {
  const [stage, setStage] = useState<stagesServices>("init");
  const [selectedService, setSelectedService] = useState<BarberService | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: services, isLoading, error } = useServices(stage !== "init");
  const queryClient = useQueryClient();

  const getStageTitle = () => {
    switch (stage) {
      case "create":
        return "Novo Serviço";
      case "edit":
        return selectedService
          ? `Editar: ${selectedService.name}`
          : "Selecionar Serviço para Editar";
      case "delete":
        return "Excluir Serviço";
      default:
        return "Painel de Serviços";
    }
  };

  const handleBack = () => {
    if (selectedService && stage === "edit") {
      setSelectedService(null);
    } else {
      setStage("init");
      setSelectedService(null);
    }
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["service"] });
    setStage("init");
    setSelectedService(null);
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      setIsDeleting(true);
      await deleteBarberServiceService(selectedService.id);
      setIsDeleteModalOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir serviço");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "62.5rem",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div
        style={{
          marginBottom: "1.875rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {stage !== "init" && (
          <button
            onClick={handleBack}
            style={{ padding: "0.5rem" }}
            className="hover:bg-black/5 rounded-full transition-colors flex items-center justify-center"
          >
            <LuArrowLeft size={24} />
          </button>
        )}
        <H2Bold>{getStageTitle()}</H2Bold>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        {isLoading && <IsFetchingAndLoading />}
        {error && <p className="text-red-500">Erro ao carregar serviços</p>}

        {stage === "create" && (
          <CreateAndEditServiceForm typeStage="create" onSuccess={onSuccess} />
        )}

        {stage === "edit" && (
          <>
            {!selectedService ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {services?.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    style={{ padding: "10px" }}
                    className="p-4 border border-gray-200 rounded-xl shadow-sm hover:border-amber-400 cursor-pointer transition-all"
                  >
                    <p className="font-bold text-lg text-[var(--textPrimary)]">{service.name}</p>
                    <p className="text-gray-400">
                      {service.durationMinutes} min -{" "}
                      {formatCurrency(service.price)}
                    </p>
                  </div>
                ))}
                {services?.length === 0 && <p>Nenhum serviço cadastrado.</p>}
              </div>
            ) : (
              <CreateAndEditServiceForm
                typeStage="edit"
                initialData={selectedService}
                onSuccess={onSuccess}
              />
            )}
          </>
        )}

        {stage === "delete" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services?.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  setSelectedService(service);
                  setIsDeleteModalOpen(true);
                }}
                style={{ padding: "10px" }}
                className="p-4 border border-gray-200 rounded-xl shadow-sm hover:border-red-400 cursor-pointer transition-all flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg text-[var(--textPrimary)]">
                    {service.name}
                  </p>
                  <p className="text-gray-400">
                    {formatCurrency(service.price)}
                  </p>
                </div>
                <LuTrash2 className="text-red-500" size={20} />
              </div>
            ))}
            {services?.length === 0 && <p>Nenhum serviço cadastrado.</p>}
          </div>
        )}
      </div>

      {stage === "init" && (
        <div
          className="gap-6"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(15.625rem, 1fr))",
          }}
        >
          <div
            onClick={() => setStage("create")}
            style={{ padding: "1.5rem" }}
            className="border border-[#2c448f] rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
          >
            <BsPlusCircleFill
              size={32}
              className="text-blue-500 group-hover:scale-110 transition-transform"
              style={{ marginBottom: "0.75rem" }}
            />
            <H2Bold>Criar Serviço</H2Bold>
            <p
              className="text-sm text-gray-500"
              style={{ marginTop: "0.5rem" }}
            >
              Adicione novos itens ao catálogo
            </p>
          </div>

          <div
            onClick={() => setStage("edit")}
            style={{ padding: "1.5rem" }}
            className="border border-[#8f882c] rounded-2xl shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
          >
            <LuPencil
              size={32}
              className="text-amber-500 group-hover:scale-110 transition-transform"
              style={{ marginBottom: "0.75rem" }}
            />
            <H2Bold>Editar Serviço</H2Bold>
            <p
              className="text-sm text-gray-500"
              style={{ marginTop: "0.5rem" }}
            >
              Modifique preços e descrições
            </p>
          </div>

          <div
            onClick={() => setStage("delete")}
            style={{ padding: "1.5rem" }}
            className="border border-[#8f2c2c] rounded-2xl shadow-sm hover:shadow-md hover:border-red-400 transition-all cursor-pointer group"
          >
            <LuTrash2
              size={32}
              className="text-red-500 group-hover:scale-110 transition-transform"
              style={{ marginBottom: "0.75rem" }}
            />
            <H2Bold>Deletar Serviço</H2Bold>
            <p
              className="text-sm text-gray-500"
              style={{ marginTop: "0.5rem" }}
            >
              Remova serviços permanentemente
            </p>
          </div>
        </div>
      )}

      <ConfirmModal
        open={isDeleteModalOpen}
        title={`Tem certeza que deseja excluir o serviço "${selectedService?.name}"?`}
        colorConfirm="bg-red-600"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminServicesPage;
