import H2Bold from "@/components/ui/H2Bold";
import P from "@/components/ui/Span";
import { IoIosArrowBack } from "@react-icons/all-files/io/IoIosArrowBack";
import { IoMdAddCircle } from "@react-icons/all-files/io/IoMdAddCircle";
import { useNavigate } from "react-router-dom";
import { useAppointment } from "@/contexts/useAppointment";
import Button from "@/components/ui/Button";
import { TiDelete } from "react-icons/ti";
import type { AppointmentItem } from "@/contexts/appointment.interface";

const AppointmentSummaryPage = () => {
  const { removeAppointmentItemByServiceId } = useAppointment();

  const navigate = useNavigate();
  const { selectedAppointmentItems, clearAppointmentItems } = useAppointment();

  const handleAddMoreService = () => {
    navigate("/app");
  };

  const handleConfirmAppointment = () => {
    console.log("agendamento confirmado fake:", selectedAppointmentItems);
    alert("confirmar requisisao no backend");
    clearAppointmentItems();
    navigate("/app/appointments");
  };

  const handleRemoveApointmentService = (item: AppointmentItem) => {
    removeAppointmentItemByServiceId(item.serviceId);
    alert(`removeu o ${item.serviceName}`);
  };

  const formatDateTime = (dateTime: Date) => {
    return new Date(dateTime).toLocaleString("pt-BR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ paddingLeft: "0.8rem", paddingRight: "0.8rem" }}>
      <div className="flex flex-col items-start gap-4">
        <IoIosArrowBack
          onClick={() => navigate(-1)}
          size={30}
          className="cursor-pointer text-[var(--textPrimary)]"
        />

        <H2Bold>Resumo do Agendamento</H2Bold>
      </div>

      {selectedAppointmentItems.length === 0 ? (
        <P style={{ marginTop: "1rem" }}>Nenhum serviço selecionado ainda.</P>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          {selectedAppointmentItems.map((item) => (
            <div
              key={item.serviceId}
              style={{
                marginBottom: "1rem",
                padding: "0.8rem ",
              }}
              className="
              border-3
              border-dotted
              border-[var(--textPrimary)]
              rounded-[2px]
              flex
              flex-row
              justify-between
              "
            >
              <div className="flex flex-col">
                <P>
                  <span className="font-bold">Serviço:</span> {item.serviceName}
                </P>
                <P>
                  <span className="font-bold">Barbeiro:</span> {item.barberName}
                </P>
                <P>
                  <span className="font-bold">Quando:</span>{" "}
                  {formatDateTime(item.dateTime)}
                </P>
              </div>
              <TiDelete
                size={22}
                onClick={() => handleRemoveApointmentService(item)}
              />
            </div>
          ))}

          <div style={{ marginTop: "1.5rem" }} className="flex justify-center">
            <div
              style={{ padding: "0.6rem", marginTop: "0.6rem" }}
              className="flex items-center justify-between gap-4 w-fit cursor-pointer border-2 border-[var(--textPrimary)] rounded-sm"
              onClick={handleAddMoreService}
            >
              <IoMdAddCircle size={25} />
              <P>adicionar mais</P>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <Button onClick={handleConfirmAppointment}>
              Confirmar Agendamento
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentSummaryPage;
