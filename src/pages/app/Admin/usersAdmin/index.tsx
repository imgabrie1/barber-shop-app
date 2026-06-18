import H2Bold from "@/components/ui/H2Bold";
import { useState } from "react";
import { LuArrowLeft, LuUser, LuList, LuUserPlus } from "react-icons/lu";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "@/components/common/ConfirmModal";
import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import { useUsersToAdmin } from "@/features/Admin/hooks/useGetUsers";
import { useUserToAdmin } from "@/features/Admin/hooks/useGetUserByID";
import { useDeleteUser } from "@/features/Admin/hooks/useDeleteUser";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import CreateUserForm from "@/components/common/CreateUserForm";
import { register as registerBarber } from "@/services/auth.service";
import type { RegisterDTO } from "@/schemas/register.schemas";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Span from "@/components/ui/Span";

type stagesUsers = "init" | "list" | "createBarber" | "createManager" | "delete";

const AdminUsersPage = () => {
  const [stage, setStage] = useState<stagesUsers>("init");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successConfig, setSuccessConfig] = useState({
    open: false,
    message: "",
  });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteUserMutation, isPending: isDeletingUser } =
    useDeleteUser();

  const getrole = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "barber":
        return "Barbeiro(a)";
      case "manager":
        return "Gerente";
      case "client":
        return "Cliente";
      default:
        return "Cliente";
    }
  };

  const {
    data: users,
    isLoading,
    isFetching,
    error,
  } = useUsersToAdmin(currentPage, stage !== "init");

  const { data: userDetails, isFetching: isFetchingUser } = useUserToAdmin(
    selectedUserId || "",
  );

  const getStageTitle = () => {
    switch (stage) {
      case "list":
        return "Lista de Usuários";
      case "createBarber":
        return "Criar Barbeiro";
      case "createManager":
        return "Criar Gerente";
      default:
        return "Painel de Usuários";
    }
  };

  const handleBack = () => {
    if (stage === "init") {
      navigate(-1);
    } else {
      setStage("init");
      setSelectedUserId(null);
      setCurrentPage(1);
    }
  };

  const handleShowDetails = (id: string) => {
    setSelectedUserId(id);
    setIsDetailsModalOpen(true);
  };

  const onSuccessAction = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    setSelectedUserId(null);
    setStage("init");
    setCurrentPage(1);
  };

  const handleCreateBarber = async (data: RegisterDTO & { role?: string }) => {
    await registerBarber(data);
    setSuccessConfig({ open: true, message: "Barbeiro criado com sucesso!" });
  };

  const handleCreateManager = async (data: RegisterDTO & { role?: string }) => {
    await registerBarber(data);
    setSuccessConfig({ open: true, message: "Gerente criado com sucesso!" });
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      await deleteUserMutation(selectedUserId);
      setIsDeleteModalOpen(false);
      setIsDetailsModalOpen(false);
      setSuccessConfig({
        open: true,
        message: `Usuário removido com sucesso!`,
      });
      onSuccessAction();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir usuário");
    }
  };

  const handleNextPage = () => {
    if (users && currentPage < Math.ceil(users.total / users.limit)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = users
    ? currentPage >= Math.ceil(users.total / users.limit)
    : true;

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

      {stage === "init" && (
        <div
          className="gap-6"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(15.625rem, 1fr))",
          }}
        >
          <div
            onClick={() => setStage("list")}
            style={{ padding: "1.5rem" }}
            className="border border-[#2c448f] rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
          >
            <LuList
              size={32}
              className="text-blue-500 group-hover:scale-110 transition-transform"
              style={{ marginBottom: "0.75rem" }}
            />
            <H2Bold>Listar Usuários</H2Bold>
            <p
              className="text-sm text-gray-500"
              style={{ marginTop: "0.5rem" }}
            >
              Verifique todos os cadastros
            </p>
          </div>

          <div
            onClick={() => setStage("createBarber")}
            style={{ padding: "1.5rem" }}
            className="border border-[#2c8f44] rounded-2xl shadow-sm hover:shadow-md hover:border-green-400 transition-all cursor-pointer group"
          >
            <LuUserPlus
              size={32}
              className="text-green-500 group-hover:scale-110 transition-transform"
              style={{ marginBottom: "0.75rem" }}
            />
            <H2Bold>Adicionar Barbeiro</H2Bold>
            <p
              className="text-sm text-gray-500"
              style={{ marginTop: "0.5rem" }}
            >
              Cadastre novos profissionais
            </p>
          </div>

          <div
            onClick={() => setStage("createManager")}
            style={{ padding: "1.5rem" }}
            className="border border-[#2c8f44] rounded-2xl shadow-sm hover:shadow-md hover:border-green-400 transition-all cursor-pointer group"
          >
            <LuUserPlus
              size={32}
              className="text-green-500 group-hover:scale-110 transition-transform"
              style={{ marginBottom: "0.75rem" }}
            />
            <H2Bold>Adicionar Gerente</H2Bold>
            <p
              className="text-sm text-gray-500"
              style={{ marginTop: "0.5rem" }}
            >
              Cadastre novos gerente de loja
            </p>
          </div>
        </div>
      )}

      {stage === "createBarber" && (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <CreateUserForm onSuccess={handleCreateBarber} defaultRole="barber" />
        </div>
      )}

      {stage === "createManager" && (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <CreateUserForm onSuccess={handleCreateManager} defaultRole="manager" />
        </div>
      )}

      {stage === "list" && (
        <div style={{ marginTop: "30px" }} className="mb-6">
          {isLoading && <IsFetchingAndLoading />}
          {error && <ErrorMessage isMissing="usuários" />}

          <div className="grid grid-cols-1 gap-5">
            {users?.data?.map((user) => (
              <div
                key={user.id}
                onClick={() =>
                  stage === "list" ? handleShowDetails(user.id) : null
                }
                style={{ padding: "20px" }}
                className={`
                  border rounded-xl flex justify-between items-center
                  transition-all shadow-sm
                  ${
                    stage === "list"
                      ? "hover:border-blue-400 cursor-pointer border-gray-200"
                      : "border-gray-200"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      stage === "list"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <LuUser size={20} />
                  </div>
                  <div>
                    <div className="flex gap-3">
                      <p className="font-bold text-[var(--textPrimary)]">
                        {user.name}
                      </p>
                      <p>-</p>
                      <p className="font-medium">
                        {getrole(user.role)}
                        {user.role === "barber" && user.commissionPercentage !== undefined && (
                          <span className="ml-1 text-xs text-blue-500 font-bold">
                            ({user.commissionPercentage}%)
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="text-sm text-gray-400">{user.phoneNumber}</p>
                  </div>
                </div>
              </div>
            ))}
            {users?.data?.length === 0 && !isLoading && (
              <p>Nenhum usuário encontrado.</p>
            )}
          </div>

          {users && users.total > users.limit && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <IoIosArrowBack
                size={24}
                onClick={handlePrevPage}
                className="text-[var(--textPrimary)]"
                style={{
                  cursor: isFirstPage ? "default" : "pointer",
                  opacity: isFirstPage ? 0.3 : 1,
                }}
              />
              <Span style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                Página {currentPage} de {Math.ceil(users.total / users.limit)}
              </Span>
              <IoIosArrowForward
                size={24}
                onClick={handleNextPage}
                className="text-[var(--textPrimary)]"
                style={{
                  cursor: isLastPage ? "default" : "pointer",
                  opacity: isLastPage ? 0.3 : 1,
                }}
              />
            </div>
          )}
          {isFetching && !isLoading && (
             <p className="text-center text-xs text-gray-400 mt-2">Carregando...</p>
          )}
        </div>
      )}

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
                <span className=" ">{getrole(userDetails?.role)}</span>
              </div>
              {userDetails?.role === "barber" && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Comissão
                  </p>
                  <p className="text-[var(--textPrimary)]">
                    {userDetails.commissionPercentage ?? 0}%
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-3 mt-4">
                <Button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Excluir Usuário
                </Button>
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

      <ConfirmModal
        open={isDeleteModalOpen}
        title={`Deseja realmente excluir a conta de "${userDetails?.name}"?`}
        colorConfirm="bg-red-600"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={isDeletingUser}
      />
    </div>
  );
};

export default AdminUsersPage;
