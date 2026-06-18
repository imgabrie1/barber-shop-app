import { useAuth } from "@/app/providers/AuthProvider";
import ConfirmModal from "@/components/common/ConfirmModal";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import Button from "@/components/ui/Button";
import H2Bold from "@/components/ui/H2Bold";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import Span from "@/components/ui/Span";
import { useMutationAppointment } from "@/features/Appointments/hooks/useMutationAppointment";
import { useMyAppointments } from "@/features/Appointments/hooks/useMyAppointments";
import { appointmentStatusMap } from "@/interfaces/appointments.interface";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const AppointmentsPage = () => {
  type ActionType = "cancel" | "delete" | "confirm" | "complete";

  const modalConfig: Record<
    ActionType,
    { title: string; buttonColor: string }
  > = {
    cancel: {
      title: "Cancelar agendamento?",
      buttonColor: "bg-[var(--red)]",
    },
    delete: {
      title: "Excluir agendamento?",
      buttonColor: "bg-[var(--red)]",
    },
    confirm: {
      title: "Confirmar agendamento?",
      buttonColor: "bg-[var(--success)]",
    },
    complete: {
      title: "O serviço já foi pago?",
      buttonColor: "bg-[var(--success)]",
    },
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: appointmentsData,
    isLoading,
    isFetching,
    error,
  } = useMyAppointments(currentPage);

  const {
    mutate: mutateAppointment,
    isPending,
    variables,
  } = useMutationAppointment();

  const { user } = useAuth();

  const appointments = appointmentsData?.data ?? [];

  const isThisItemLoading = (id: string) => {
    return isPending && variables?.id === id;
  };

  const handleCancelAppointment = (id: string) => {
    setSelectedId(id);
    setActionType("cancel");
    setModalOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    setSelectedId(id);
    setActionType("delete");
    setModalOpen(true);
  };

  const handleConfirmAppointment = (id: string) => {
    setSelectedId(id);
    setActionType("confirm");
    setModalOpen(true);
  };

  const handleCompleteAppointment = (id: string) => {
    setSelectedId(id);
    setActionType("complete");
    setModalOpen(true);
  };

  const handleConfirmInModal = () => {
    if (!selectedId || !actionType) return;

    mutateAppointment({ id: selectedId, action: actionType });

    setModalOpen(false);
    setSelectedId(null);
    setActionType(null);
  };

  const handleNextPage = () => {
    if (
      appointmentsData &&
      currentPage < Math.ceil(appointmentsData.total / appointmentsData.limit)
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const isFirstPage = currentPage === 1;

  const isLastPage = appointmentsData
    ? currentPage >= Math.ceil(appointmentsData.total / appointmentsData.limit)
    : true;

  if (isLoading) return <IsFetchingAndLoading />;

  if (error) {
    console.log(error);
    return <ErrorMessage isMissing="agendamentos" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {modalOpen && (
        <ConfirmModal
          open={modalOpen}
          title={modalConfig[actionType!].title}
          onCancel={() => setModalOpen(false)}
          onConfirm={handleConfirmInModal}
          colorConfirm={modalConfig[actionType!].buttonColor}
        />
      )}

      {appointments.length === 0 ? (
        <div
          className="mt-4 text-center text-gray-500"
        >
          <H2Bold>Nenhum agendamento encontrado.</H2Bold>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            {appointments.map((item) => {
              const isBarberOrManager =
                (user?.role === "barber" && item.barber.id === user.id) ||
                user?.role === "manager";

              const showCompletedButton = item.status === "confirmed";

              const showCancelButton =
                item.status === "pending" || item.status === "confirmed";

              const showDeleteButton =
                item.status === "cancelled" || item.status === "completed";

              const isCompleted = item.status === "completed";

              const service = item.services[0];

              if (!service) return null;

              const status = appointmentStatusMap[item.status];

              return (
                <div
                  key={item.id}
                  className="mb-4 items-center cursor-pointer border-white/20 border-b md:border md:px-4 md:rounded-lg"
                >
                  <div className="py-4">
                    <p>Serviço: {service.name}</p>
                    <p>Duração: {service.durationMinutes} min</p>

                    <p className={status.color}>{status.label}</p>

                    {!isCompleted && (
                      <>
                        {isBarberOrManager && (
                          <div style={{ marginTop: "0.9375rem" }}>
                            {showCompletedButton ? (
                              <Button
                                className="w-full"
                                onClick={() =>
                                  handleCompleteAppointment(item.id)
                                }
                              >
                                {isThisItemLoading(item.id)
                                  ? "Finalizando..."
                                  : "Finalizar Pagamento"}
                              </Button>
                            ) : (
                              item.status === "pending" && (
                                <Button
                                  className="w-full"
                                  onClick={() =>
                                    handleConfirmAppointment(item.id)
                                  }
                                >
                                  {isThisItemLoading(item.id)
                                    ? "Confirmando..."
                                    : "Confirmar Agendamento"}
                                </Button>
                              )
                            )}
                          </div>
                        )}

                        {showCancelButton && (
                          <div style={{ marginTop: "0.9375rem" }}>
                            <Button
                              className="w-full"
                              onClick={() => handleCancelAppointment(item.id)}
                            >
                              {isThisItemLoading(item.id)
                                ? "Cancelando..."
                                : "Cancelar"}
                            </Button>
                          </div>
                        )}
                      </>
                    )}

                    {showDeleteButton && (
                      <div className="mt-4">
                        <Button
                          className="w-full"
                          onClick={() => handleDeleteAppointment(item.id)}
                        >
                          {isThisItemLoading(item.id)
                            ? "Excluindo..."
                            : "Excluir"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {appointmentsData &&
            appointmentsData.total > appointmentsData.limit && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex items-center justify-center gap-4">
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
                    Página {currentPage} de{" "}
                    {Math.ceil(appointmentsData.total / appointmentsData.limit)}
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

                {isFetching && !isLoading && (
                  <p className="text-center text-xs text-gray-400">
                    Carregando...
                  </p>
                )}
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default AppointmentsPage;
