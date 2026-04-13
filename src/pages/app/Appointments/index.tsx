import Button from "@/components/ui/Button";
import IsFeatchingAndLoadingAndLoading from "@/components/ui/IsFeatchingAndLoading";
import { useMyAppointments } from "@/features/Appointments/hooks/useMyAppointments";
import { appointmentStatusMap } from "@/interfaces/appointments.interface";

const AppointmentsPage = () => {
  const { data: appointmentsData, isFetching, error } = useMyAppointments();

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
      {appointmentsData?.data.map((item) => {
        const showButton =
          item.status === "pending" || item.status === "confirmed";
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

              {showButton && (
                <div style={{ marginTop: "0.9375rem" }}>
                  <Button
                    className="w-full"
                    onClick={() => console.log("teste")}
                  >
                    Cancelar
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
