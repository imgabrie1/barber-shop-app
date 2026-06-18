import H2Bold from "@/components/ui/H2Bold";
import { useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { LuPencil, LuTrash2, LuArrowLeft, LuStore } from "react-icons/lu";
import { useServices } from "@/features/barberServices/hooks/useBarbersServices";
import { useShopUnits } from "@/features/barberServices/hooks/useShopUnits";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import { formatCurrency } from "@/utils/masks";
import { useQueryClient } from "@tanstack/react-query";
import { deleteBarberServiceService } from "@/features/Admin/services/admin.service";
import ConfirmModal from "@/components/common/ConfirmModal";
import type { BarberService } from "@/interfaces/barber.interface";
import CreateAndEditServiceForm from "@/components/common/CreateAndEditServiceForm";
import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Span from "@/components/ui/Span";

type stagesServices =
  | "init"
  | "selectShop"
  | "createService"
  | "edit"
  | "delete";

const AdminServicesPage = () => {
  const [stage, setStage] = useState<stagesServices>("init");
  const [targetAction, setTargetAction] = useState<stagesServices | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState<BarberService | null>(
    null,
  );
  const [successConfig, setSuccessConfig] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: shops, isLoading: isLoadingShops } = useShopUnits(
    stage === "selectShop",
  );
  const {
    data: services,
    isLoading,
    isFetching,
    error,
  } = useServices(
    selectedShopId,
    currentPage,
    !!selectedShopId && stage !== "init" && stage !== "selectShop",
  );

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getStageTitle = () => {
    if (stage === "selectShop") return "Selecione a Unidade";

    switch (stage) {
      case "createService":
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
    if (stage === "init") {
      navigate(-1);
    } else if (stage === "selectShop") {
      setStage("init");
      setTargetAction(null);
    } else if (selectedService && stage === "edit") {
      setSelectedService(null);
    } else {
      setStage("selectShop");
      setSelectedService(null);
      setCurrentPage(1);
    }
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["service", selectedShopId] });
    setStage("init");
    setSelectedService(null);
    setSelectedShopId("");
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      setIsDeleting(true);
      await deleteBarberServiceService(selectedService.id);
      setIsDeleteModalOpen(false);

      setSuccessConfig({
        open: true,
        message: `Serviço "${selectedService.name}" excluído com sucesso!`,
      });

      queryClient.invalidateQueries({ queryKey: ["service", selectedShopId] });
    } catch (err) {
      console.log(err);
      alert("Erro ao excluir");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = (msg: string) => {
    setSuccessConfig({
      open: true,
      message: msg,
    });
    onSuccess();
  };

  const startAction = (action: stagesServices) => {
    setTargetAction(action);
    setStage("selectShop");
  };

  const handleSelectShop = (id: string) => {
    setSelectedShopId(id);
    if (targetAction) {
      setStage(targetAction);
    }
  };

  const handleNextPage = () => {
    if (services && currentPage < Math.ceil(services.total / services.limit)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = services
    ? currentPage >= Math.ceil(services.total / services.limit)
    : true;

  return (
    <div className="mx-auto w-full">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center"
        >
          <LuArrowLeft size={24} />
        </button>
        <H2Bold>{getStageTitle()}</H2Bold>
      </div>

      <div className="mb-6">
        {(isLoading || isLoadingShops) && <IsFetchingAndLoading />}
        {error && <ErrorMessage isMissing="serviços" />}

        {stage === "selectShop" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops?.map((shop) => (
              <div
                key={shop.id}
                onClick={() => handleSelectShop(shop.id)}
                className="border border-gray-200 p-6 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center gap-3 bg-[var(--block)] group"
              >
                <div className="p-4 bg-blue-50 rounded-full text-blue-500 group-hover:scale-110 transition-transform">
                  <LuStore size={32} />
                </div>
                <H2Bold>{shop.name}</H2Bold>
                <p className="text-sm text-gray-500">{shop.address}</p>
              </div>
            ))}
            {shops?.length === 0 && !isLoadingShops && (
              <div className="flex items-center mt-6 justify-center">
                <p className="text-2xl text-gray-400 font-bold">
                  Nenhuma unidade encontrada
                </p>
              </div>
            )}
          </div>
        )}

        {stage === "createService" && (
          <CreateAndEditServiceForm
            typeStage="createService"
            shopId={selectedShopId}
            onSuccess={() => handleFormSuccess("Serviço criado com sucesso!")}
          />
        )}

        {stage === "edit" && (
          <>
            {!selectedService ? (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services?.data?.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className="p-[10px] border border-gray-200 rounded-xl shadow-sm hover:border-amber-400 cursor-pointer transition-all"
                    >
                      <p className="font-bold text-lg text-[var(--textPrimary)]">
                        {service.name}
                      </p>
                      <p className="text-gray-400">
                        {service.durationMinutes} min -{" "}
                        {formatCurrency(service.price)}
                      </p>
                    </div>
                  ))}

                  {services?.data?.length === 0 && !isLoading && (
                    <div className="col-span-full flex justify-center items-center p-6 text-gray-500">
                      <H2Bold>Nenhum serviço cadastrado nesta unidade.</H2Bold>
                    </div>
                  )}
                </div>

                {services && services.total > services.limit && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center gap-4">
                      <IoIosArrowBack
                        size={24}
                        onClick={handlePrevPage}
                        className={`text-[var(--textPrimary)] ${
                          isFirstPage
                            ? "cursor-default opacity-30"
                            : "cursor-pointer opacity-100"
                        }`}
                      />
                      <Span className="text-[1.1rem] font-sixth-hundred font-semibold">
                        Página {currentPage} de{" "}
                        {Math.ceil(services.total / services.limit)}
                      </Span>
                      <IoIosArrowForward
                        size={24}
                        onClick={handleNextPage}
                        className={`text-[var(--textPrimary)] ${
                          isLastPage
                            ? "cursor-default opacity-30"
                            : "cursor-pointer opacity-100"
                        }`}
                      />
                    </div>
                    {isFetching && !isLoading && (
                      <p className="text-center text-xs text-gray-400">
                        Carregando...
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <CreateAndEditServiceForm
                typeStage="edit"
                shopId={selectedShopId}
                initialData={selectedService}
                onSuccess={() =>
                  handleFormSuccess("Alterações salvas com sucesso!")
                }
              />
            )}
          </>
        )}

        {stage === "delete" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services?.data?.map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-[10px] border border-gray-200 rounded-xl shadow-sm hover:border-red-400 cursor-pointer transition-all flex justify-between items-center"
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
              {services?.data?.length === 0 && !isLoading && (
                <p>Nenhum serviço cadastrado nesta unidade.</p>
              )}
            </div>

            {services && services.total > services.limit && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center gap-4">
                  <IoIosArrowBack
                    size={24}
                    onClick={handlePrevPage}
                    className={`text-[var(--textPrimary)] ${
                      isFirstPage
                        ? "cursor-default opacity-30"
                        : "cursor-pointer opacity-100"
                    }`}
                  />
                  <Span className="text-[1.1rem] font-semibold">
                    Página {currentPage} de{" "}
                    {Math.ceil(services.total / services.limit)}
                  </Span>
                  <IoIosArrowForward
                    size={24}
                    onClick={handleNextPage}
                    className={`text-[var(--textPrimary)] ${
                      isLastPage
                        ? "cursor-default opacity-30"
                        : "cursor-pointer opacity-100"
                    }`}
                  />
                </div>
                {isFetching && !isLoading && (
                  <p className="text-center text-xs text-gray-400">
                    Carregando...
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {stage === "init" && (
        <div className="gap-6 grid grid-cols-[repeat(auto-fit,minmax(15.625rem,1fr))]">
          <div
            onClick={() => startAction("createService")}
            className="p-6 border border-[#2c8f44] rounded-2xl shadow-sm hover:shadow-md hover:border-green-400 transition-all cursor-pointer group"
          >
            <BsPlusCircleFill
              size={32}
              className="text-green-500 group-hover:scale-110 transition-transform mb-3"
            />
            <H2Bold>Criar Serviço</H2Bold>
            <p className="text-sm text-gray-500 mt-2">
              Adicione novos itens ao catálogo
            </p>
          </div>

          <div
            onClick={() => startAction("edit")}
            className="p-6 border border-[#8f882c] rounded-2xl shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
          >
            <LuPencil
              size={32}
              className="text-amber-500 group-hover:scale-110 transition-transform mb-3"
            />
            <H2Bold>Editar Serviço</H2Bold>
            <p className="text-sm text-gray-500 mt-2">
              Modifique preços e descrições
            </p>
          </div>

          <div
            onClick={() => startAction("delete")}
            className="p-6 border border-[#8f2c2c] rounded-2xl shadow-sm hover:shadow-md hover:border-red-400 transition-all cursor-pointer group"
          >
            <LuTrash2
              size={32}
              className="text-red-500 group-hover:scale-110 transition-transform mb-3"
            />
            <H2Bold>Deletar Serviço</H2Bold>
            <p className="text-sm text-gray-500 mt-2">
              Remova serviços permanentemente
            </p>
          </div>
        </div>
      )}

      <Modal
        open={successConfig.open}
        onClose={() => setSuccessConfig({ ...successConfig, open: false })}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-5 bg-green-500/10 rounded-full">
            <FaCheck className="text-green-500" size={40} />
          </div>
          <H2Bold>Sucesso!</H2Bold>
          <p className="text-gray-400">{successConfig.message}</p>
          <Button
            onClick={() => setSuccessConfig({ ...successConfig, open: false })}
            className="w-full bg-green-600 hover:bg-green-700 transition-all"
          >
            Continuar
          </Button>
        </div>
      </Modal>

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
