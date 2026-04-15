import { useAuth } from "@/app/providers/AuthProvider";
import ConfirmModal from "@/components/common/ConfirmModal";
import Button from "@/components/ui/Button";
import IsFeatchingAndLoadingAndLoading from "@/components/ui/IsFeatchingAndLoading";
import { useMutationAppointment } from "@/features/Appointments/hooks/useMutationAppointment";
import { useMyAppointments } from "@/features/Appointments/hooks/useMyAppointments";
import { appointmentStatusMap } from "@/interfaces/appointments.interface";
import { useState } from "react";

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

  const { data: appointmentsData, isLoading, error } = useMyAppointments();
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

  if (isLoading) return <IsFeatchingAndLoadingAndLoading />;

  if (error) {
    return (
      <p role="alert">
        {error instanceof Error ? error.message : "Erro ao buscar serviços"}
      </p>
    );
  }

  if (appointments.length === 0) {
    return (
      <div
        style={{ marginTop: "0.9375rem" }}
        className="mt-4 text-center text-gray-500"
      >
        Nenhum agendamento encontrado.
      </div>
    );
  }

  return (
    <div>
      {modalOpen && (
        <ConfirmModal
          open={modalOpen}
          title={modalConfig[actionType!].title}
          onCancel={() => setModalOpen(false)}
          onConfirm={handleConfirmInModal}
          colorConfirm={modalConfig[actionType!].buttonColor}
        />
      )}

      {appointments.map((item) => {
        const isBarber = user?.role === "barber" && item.barber.id === user.id;
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
            className="m-2"
            style={{ marginBottom: "0.3125rem" }}
          >
            <div style={{ padding: "0.625rem" }}>
              <p>Serviço: {service.name}</p>
              <p>Duração: {service.durationMinutes} min</p>

              <p className={status.color}>{status.label}</p>

              <>
                {!isCompleted && (
                  <>
                    {isBarber && (
                      <div style={{ marginTop: "0.9375rem" }}>
                        {showCompletedButton ? (
                          <Button
                            className="w-full"
                            onClick={() => handleCompleteAppointment(item.id)}
                          >
                            {isThisItemLoading(item.id)
                              ? "Finalizando..."
                              : "Finalizar Pagamento"}
                          </Button>
                        ) : (
                          item.status === "pending" && (
                            <Button
                              className="w-full"
                              onClick={() => handleConfirmAppointment(item.id)}
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
                  <div style={{ marginTop: "0.9375rem" }}>
                    <Button
                      className="w-full"
                      onClick={() => handleDeleteAppointment(item.id)}
                    >
                      {isThisItemLoading(item.id) ? "Excluindo..." : "Excluir"}
                    </Button>
                  </div>
                )}
              </>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentsPage;
