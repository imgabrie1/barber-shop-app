import ConfirmModal from "@/components/common/ConfirmModal";
import Button from "@/components/ui/Button";
import IsFeatchingAndLoadingAndLoading from "@/components/ui/IsFeatchingAndLoading";
import { useAppointmentCancelOrDelete } from "@/features/Appointments/hooks/useAppointmentCancelOrDelete";
import { useMyAppointments } from "@/features/Appointments/hooks/useMyAppointments";
import { appointmentStatusMap } from "@/interfaces/appointments.interface";
import { useState } from "react";

const AppointmentsPage = () => {
  type ActionType = "cancel" | "delete";

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);

  const { data: appointmentsData, isFetching, error } = useMyAppointments();
  const {
    mutate: mutateAppointment,
    isPending,
    variables,
  } = useAppointmentCancelOrDelete();

  const isThisItemLoading = (id: string) => {
    return isPending && variables?.id === id;
  };

  const handleCancel = (id: string) => {
    setSelectedId(id);
    setActionType("cancel");
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log(id);
    // tem que criar a rota no backend :/
    // muda pra o que ta aqui em baixo
    // mutateAppointment({ id, action: "delete" });
    //////////////////////////////////////
    // setSelectedId(id);
    // setActionType("delete");
    // setModalOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedId || !actionType) return;

    mutateAppointment({ id: selectedId, action: actionType });

    setModalOpen(false);
    setSelectedId(null);
    setActionType(null);
  };

  if (isFetching) return <IsFeatchingAndLoadingAndLoading />;

  if (error) {
    return (
      <p role="alert">
        {error instanceof Error ? error.message : "Erro ao buscar serviços"}
      </p>
    );
  }

  return (
    <div>
      {modalOpen && (
        <ConfirmModal
          open={modalOpen}
          title={
            actionType === "cancel"
              ? "Cancelar agendamento?"
              : "Excluir agendamento?"
          }
          onCancel={() => setModalOpen(false)}
          onConfirm={handleConfirm}
          colorConfirm={
            actionType === "delete" ? "bg-[var(--red)]" : "bg-[var(--primary)]"
          }
        />
      )}
      {appointmentsData?.data.map((item) => {
        const showCancelButton =
          item.status === "pending" || item.status === "confirmed";
        const showDeleteButton = item.status === "cancelled";
        const service = item.services[0];
        if (!service) return null;

        const status = appointmentStatusMap[item.status];

        return (
          <div
            key={item.id}
            style={{ marginBottom: "0.3125rem" }}
            className="m-2"
          >
            <div style={{ padding: "0.625rem" }}>
              <p>Serviço: {service.name}</p>
              <p>Duração: {service.durationMinutes} min</p>

              <p className={status.color}>{status.label}</p>

              {showCancelButton && (
                <div style={{ marginTop: "0.9375rem" }}>
                  <Button
                    className="w-full"
                    onClick={() => handleCancel(item.id)}
                  >
                    {isThisItemLoading(item.id) ? "Cancelando..." : "Cancelar"}
                  </Button>
                </div>
              )}

              {showDeleteButton && (
                <div style={{ marginTop: "0.9375rem" }}>
                  <Button
                    className="w-full"
                    onClick={() => handleDelete(item.id)}
                  >
                    {isThisItemLoading(item.id) ? "Excluindo..." : "Excluir"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentsPage;
