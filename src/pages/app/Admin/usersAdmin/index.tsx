import H2Bold from "@/components/ui/H2Bold";
import { useState } from "react";
import { LuTrash2, LuArrowLeft, LuUser, LuSearch } from "react-icons/lu";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "@/components/common/ConfirmModal";
import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import { useUsersToAdmin } from "@/features/Admin/hooks/useGetUsers";
import { useUserToAdmin } from "@/features/Admin/hooks/useGetUserByID";

type stagesUsers = "init" | "get" | "delete";

const AdminUsersPage = () => {
  const [stage, setStage] = useState<stagesUsers>("init");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successConfig, setSuccessConfig] = useState({
    open: false,
    message: "",
  });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getrole = () => {
    switch (userDetails?.role) {
      case "admin":
        return "Admin";
      case "barber":
        return "Barbeiro(a)";
      case "client":
        return "Cliente";
    }
  };

  // HOOKS REAIS
  const { data: users, isLoading, error } = useUsersToAdmin(stage !== "init");

  // Hook para buscar detalhes quando um usuário for selecionado
  const { data: userDetails, isFetching: isFetchingUser } = useUserToAdmin(
    selectedUserId || "",
  );

  const getStageTitle = () => {
    switch (stage) {
      case "get":
        return "Lista de Usuários";
      case "delete":
        return "Excluir Usuário";
      default:
        return "Painel de Usuários";
    }
  };

  const handleShowDetails = (id: string) => {
    setSelectedUserId(id);
    setIsDetailsModalOpen(true);
  };

  const handleBack = () => {
    if (stage === "init") return navigate(-1);
    setStage("init");
    setSelectedUserId(null);
  };

  const onSuccessAction = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    setStage("init");
    setSelectedUserId(null);
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      setIsDeleting(true);

      // Lógica de delete (Mockada conforme solicitado)
      console.log(`Chamando API para deletar usuário ID: ${selectedUserId}`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula delay

      setIsDeleteModalOpen(false);
      setSuccessConfig({
        open: true,
        message: `Usuário removido com sucesso!`,
      });
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir usuário");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: "62.5rem", margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-[1.875rem]">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <LuArrowLeft size={24} />
        </button>
        <H2Bold>{getStageTitle()}</H2Bold>
      </div>

      <div style={{ marginTop: "30px" }} className="mb-6">
        {isLoading && <IsFetchingAndLoading />}
        {error && <p className="text-red-500">Erro ao carregar usuários.</p>}

        {/* LISTAGEM DE USUÁRIOS (GET) */}
        {stage === "get" && (
          <div className="grid grid-cols-1 gap-5">
            {users?.map((user) => (
              <div
                key={user.id}
                onClick={() => handleShowDetails(user.id)}
                style={{ padding: "20px" }}
                className={`
                  border
                  rounded-xl
                  flex
                  justify-between
                  items-center
                  hover:border-blue-400
                  cursor-pointer
                  transition-all
                  shadow-sm
                  ${
                    selectedUserId === user.id
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "border-gray-200"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <LuUser size={20} />
                  </div>
                  <div>
                    <div className="flex gap-3">
                      <p className="font-bold text-[var(--textPrimary)]">
                        {user.name}
                      </p>
                      <p>-</p>
                      <p>{getrole()}</p>
                    </div>
                    <p className="text-sm text-gray-400">{user.phoneNumber}</p>
                  </div>
                </div>
              </div>
            ))}
            {users?.length === 0 && !isLoading && (
              <p>Nenhum usuário encontrado.</p>
            )}
          </div>
        )}

        {/* MODO EXCLUSÃO (DELETE) */}
        {stage === "delete" && (
          <div className="grid grid-cols-1 gap-4">
            {users?.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedUserId(user.id);
                  setIsDeleteModalOpen(true);
                }}
                className="p-4 border border-gray-200 rounded-xl flex justify-between items-center hover:border-red-400 cursor-pointer transition-all"
              >
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.phoneNumber}</p>
                </div>
                <LuTrash2 className="text-red-500" size={20} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DASHBOARD INICIAL (INIT) */}
      {stage === "init" && (
        <div
          style={{ paddingTop: "30px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div
            onClick={() => setStage("get")}
            style={{ padding: "1.5rem" }}
            className="border border-blue-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer group transition-all"
          >
            <LuSearch
              size={32}
              className="text-blue-500 mb-3 group-hover:scale-110 transition-transform"
            />
            <H2Bold>Visualizar Usuários</H2Bold>
            <p className="text-sm text-gray-500 mt-2">
              Gerencie perfis e permissões dos usuários
            </p>
          </div>

          <div
            onClick={() => setStage("delete")}
            style={{ padding: "1.5rem" }}
            className="border border-red-200 rounded-2xl shadow-sm hover:shadow-md hover:border-red-400 cursor-pointer group transition-all"
          >
            <LuTrash2
              size={32}
              className="text-red-500 mb-3 group-hover:scale-110 transition-transform"
            />
            <H2Bold>Excluir Usuários</H2Bold>
            <p className="text-sm text-gray-500 mt-2">
              Remover contas permanentemente
            </p>
          </div>
        </div>
      )}

      {/* MODAL DE SUCESSO */}
      <Modal
        open={successConfig.open}
        onClose={() => {
          setSuccessConfig({ ...successConfig, open: false });
          onSuccessAction();
        }}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-green-500/10 p-5 rounded-full">
            <FaCheck className="text-green-500" size={40} />
          </div>
          <H2Bold>Concluído!</H2Bold>
          <p className="text-gray-400">{successConfig.message}</p>
          <Button
            onClick={() => {
              setSuccessConfig({ ...successConfig, open: false });
              onSuccessAction();
            }}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Entendido
          </Button>
        </div>
      </Modal>

      <Modal
        open={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUserId(null);
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="bg-blue-500/10 p-2 rounded-full text-blue-500">
              <LuUser size={24} />
            </div>
            <H2Bold>Detalhes do Usuário</H2Bold>
          </div>

          {isFetchingUser ? (
            <div className="py-10">
              <IsFetchingAndLoading />
            </div>
          ) : userDetails ? (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Nome
                </p>
                <p className="text-[var(--textPrimary)] font-medium">
                  {userDetails.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Celular
                </p>
                <p className="text-[var(--textPrimary)]">
                  {userDetails.phoneNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Cargo
                </p>
                <span
                  className="
                inline-block
                bg-blue-100
                text-blue-700
                text-xs
                rounded-md
                font-bold
                uppercase
                "
                  style={{ marginTop: "10px", padding: "8px" }}
                >
                  {getrole()}
                </span>
              </div>
              {/* Adicione aqui outros campos que sua interface userByIDtoAdminViewInterface possua */}
              <div style={{ marginTop: "20px" }}>
                <Button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-full border"
                >
                  Fechar
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-red-500 text-center py-4">
              Erro ao carregar informações.
            </p>
          )}
        </div>
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO DE DELETE */}
      <ConfirmModal
        open={isDeleteModalOpen}
        title="Deseja realmente excluir este usuário?"
        colorConfirm="bg-red-600"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminUsersPage;
