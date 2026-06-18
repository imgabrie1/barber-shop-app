import { ErrorMessage } from "@/components/common/ErrorMessage";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import { useShopUnits } from "@/features/barberServices/hooks/useShopUnits";
import { useState } from "react";
import { BiSolidBusiness } from "react-icons/bi";
import { MdAddBusiness } from "react-icons/md";
import { LuArrowLeft, LuPencil, LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import H2Bold from "@/components/ui/H2Bold";
import CreateAndEditShopUnityForm from "@/components/common/CreateShopUnity";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/common/Modal";
import { FaCheck } from "react-icons/fa";
import Button from "@/components/ui/Button";
import type { ShopUnity } from "@/interfaces/admin.interface";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useShopMutation } from "@/features/Admin/hooks/useShopMutation";

type stagesShops =
  | "init"
  | "createShop"
  | "listShops"
  | "editShop"
  | "deleteShop";

const AdminShopUnitsPage = () => {
  const [stage, setStage] = useState<stagesShops>("init");
  const [selectedShop, setSelectedShop] = useState<ShopUnity | null>(null);
  const [successConfig, setSuccessConfig] = useState({
    open: false,
    message: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { deleteMutation } = useShopMutation();

  const {
    data: shopUnitsData,
    isLoading: isLoadingShops,
    error: errorShopUnits,
  } = useShopUnits();

  const getStageTitle = () => {
    switch (stage) {
      case "createShop":
        return "Nova Unidade";
      case "listShops":
        return "Lista de Unidades";
      case "editShop":
        return selectedShop
          ? `Editar: ${selectedShop.name}`
          : "Selecionar Unidade para Editar";
      case "deleteShop":
        return "Excluir Unidade";
      default:
        return "Painel de Unidades";
    }
  };

  const handleBack = () => {
    if (stage === "init") {
      navigate(-1);
    } else if (stage === "editShop" && selectedShop) {
      setSelectedShop(null);
    } else {
      setStage("init");
      setSelectedShop(null);
    }
  };

  const handleFormSuccess = (msg: string) => {
    setSuccessConfig({
      open: true,
      message: msg,
    });
    queryClient.invalidateQueries({ queryKey: ["shopUnits"] });
    setStage("init");
    setSelectedShop(null);
  };

  const handleDelete = async () => {
    if (!selectedShop) return;
    try {
      await deleteMutation.mutateAsync(selectedShop.id);
      setIsDeleteModalOpen(false);
      handleFormSuccess(`Unidade "${selectedShop.name}" excluída com sucesso!`);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir unidade");
    }
  };

  return (
    <div style={{ maxWidth: "62.5rem", margin: "0 auto", width: "100%" }}>
      <div className="flex items-center gap-4 mb-[1.875rem]">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <LuArrowLeft size={24} />
        </button>
        <H2Bold>{getStageTitle()}</H2Bold>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        {isLoadingShops && <IsFetchingAndLoading />}
        {errorShopUnits && <ErrorMessage isMissing="Unidades" />}

        {stage === "createShop" && (
          <CreateAndEditShopUnityForm
            typeStage="createShop"
            onSuccess={() => handleFormSuccess("Unidade criada com sucesso!")}
          />
        )}

        {stage === "editShop" && (
          <>
            {!selectedShop ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shopUnitsData?.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => setSelectedShop(shop as ShopUnity)}
                    style={{ padding: "20px" }}
                    className="border border-gray-200 rounded-xl shadow-sm hover:border-amber-400 cursor-pointer transition-all"
                  >
                    <p className="font-bold text-lg text-[var(--textPrimary)]">
                      {shop.name}
                    </p>
                    <p className="text-gray-400 text-sm">{shop.address}</p>
                  </div>
                ))}
                {shopUnitsData?.length === 0 && (
                  <div className="flex items-center mt-6 justify-center">
                    <p className="text-2xl text-gray-400 font-bold ">
                      Nenhuma unidade cadastrada
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <CreateAndEditShopUnityForm
                typeStage="editShop"
                initialData={selectedShop}
                onSuccess={() =>
                  handleFormSuccess("Alterações salvas com sucesso!")
                }
              />
            )}
          </>
        )}

        {stage === "deleteShop" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shopUnitsData?.map((shop) => (
              <div
                key={shop.id}
                onClick={() => {
                  setSelectedShop(shop as ShopUnity);
                  setIsDeleteModalOpen(true);
                }}
                style={{ padding: "20px" }}
                className="border border-gray-200 rounded-xl shadow-sm hover:border-red-400 cursor-pointer transition-all flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg text-[var(--textPrimary)]">
                    {shop.name}
                  </p>
                  <p className="text-gray-400 text-sm">{shop.address}</p>
                </div>
                <LuTrash2 className="text-red-500" size={20} />
              </div>
            ))}
            {shopUnitsData?.length === 0 && !isLoadingShops && (
              <div className="flex items-center mt-6 justify-center">
                <p className="text-2xl text-gray-400 font-bold ">
                  Nenhuma unidade cadastrada
                </p>
              </div>
            )}
          </div>
        )}

        {stage === "listShops" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {shopUnitsData?.map((shop) => (
              <div
                key={shop.id}
                className="border border-gray-200 rounded-xl p-5 shadow-sm flex items-start gap-4"
              >
                <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                  <BiSolidBusiness size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-[var(--textPrimary)] text-lg">
                    {shop.name}
                  </p>
                  <p className="text-gray-500 text-sm">{shop.address}</p>
                  <div className="flex gap-4 mt-2 text-sm font-medium text-gray-400">
                    {shop.alwaysOpen ? (
                      <p>Aberto 24h</p>
                    ) : (
                      <>
                        <p>Abre: {shop.businessStartHour}h</p>
                        <p>Fecha: {shop.businessEndHour}h</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {shopUnitsData?.length === 0 && !isLoadingShops && (
              <div className="flex items-center mt-6 justify-center">
                <p className="text-2xl text-gray-400 font-bold ">
                  Nenhuma unidade encontrada
                </p>
              </div>
            )}
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
            onClick={() => setStage("createShop")}
            style={{ padding: "1.5rem" }}
            className="border border-[#2c8f44] rounded-2xl shadow-sm hover:shadow-md hover:border-green-400 transition-all cursor-pointer group"
          >
            <MdAddBusiness
              size={32}
              className="text-green-500 group-hover:scale-110 transition-transform"
              style={{ marginBottom: "0.75rem" }}
            />
            <H2Bold>Criar Unidade</H2Bold>
            <p
              className="text-sm text-gray-500"
              style={{ marginTop: "0.5rem" }}
            >
              Adicione novas unidades de loja
            </p>
          </div>

          <div
            onClick={() => setStage("listShops")}
            style={{ padding: "1.5rem" }}
            className="border border-[#2c448f] rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
          >
            <BiSolidBusiness
              size={32}
              className="text-blue-500 group-hover:scale-110 transition-transform"
              style={{ marginBottom: "0.75rem" }}
            />
            <H2Bold>Listar Unidades</H2Bold>
            <p
              className="text-sm text-gray-500"
              style={{ marginTop: "0.5rem" }}
            >
              Verifique todas as unidades
            </p>
          </div>

          <div
            onClick={() => setStage("editShop")}
            style={{ padding: "1.5rem" }}
            className="border border-[#8f882c] rounded-2xl shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
          >
            <LuPencil
              size={32}
              className="text-amber-500 group-hover:scale-110 transition-transform"
              style={{ marginBottom: "0.75rem" }}
            />
            <H2Bold>Editar Unidade</H2Bold>
            <p
              className="text-sm text-gray-500"
              style={{ marginTop: "0.5rem" }}
            >
              Modifique informações das unidades
            </p>
          </div>

          <div
            onClick={() => setStage("deleteShop")}
            style={{ padding: "1.5rem" }}
            className="border border-[#8f2c2c] rounded-2xl shadow-sm hover:shadow-md hover:border-red-400 transition-all cursor-pointer group"
          >
            <LuTrash2
              size={32}
              className="text-red-500 group-hover:scale-110 transition-transform"
              style={{ marginBottom: "0.75rem" }}
            />
            <H2Bold>Deletar Unidade</H2Bold>
            <p
              className="text-sm text-gray-500"
              style={{ marginTop: "0.5rem" }}
            >
              Remova unidades permanentemente
            </p>
          </div>
        </div>
      )}

      <Modal
        open={successConfig.open}
        onClose={() => setSuccessConfig({ ...successConfig, open: false })}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-green-500/10 p-5 rounded-full">
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
        title={`Tem certeza que deseja excluir a unidade "${selectedShop?.name}"?`}
        colorConfirm="bg-red-600"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminShopUnitsPage;
