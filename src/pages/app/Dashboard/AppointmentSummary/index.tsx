import H2Bold from "@/components/ui/H2Bold";
import P from "@/components/ui/Span";
import { IoIosArrowBack } from "@react-icons/all-files/io/IoIosArrowBack";
import { IoMdAddCircle } from "@react-icons/all-files/io/IoMdAddCircle";
import { useNavigate } from "react-router-dom";
import { useAppointment } from "@/contexts/useAppointment";
import Button from "@/components/ui/Button";
import { TiDelete } from "react-icons/ti";
import type { AppointmentItem } from "@/contexts/appointment.interface";
import { useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useCreateAppointment } from "@/features/Appointments/hooks/useCreateAppointment";

const AppointmentSummaryPage = () => {
  const [modalRemoveItem, setModalRemoveItem] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<AppointmentItem | null>(
    null,
  );

  const navigate = useNavigate();

  const {
    selectedAppointmentItems,
    clearAppointmentItems,
    removeAppointmentItemByDateAndID,
  } = useAppointment();

  const { mutateAsync, isPending } = useCreateAppointment();

  const handleAddMoreService = () => {
    navigate("/app");
  };

  const handleConfirmAppointment = async () => {
    if (selectedAppointmentItems.length === 0) return;
    if (isPending) return;

    try {
      for (const item of selectedAppointmentItems) {
        await mutateAsync({
          startTime: item.dateTime.toISOString(),
          barberId: item.barberId,
          serviceIds: [item.serviceId],
        });
      }

      clearAppointmentItems();
      navigate("/app/appointments");
    } catch (err) {
      console.error("Erro ao criar agendamentos:", err);
      alert("Erro ao confirmar agendamento");
    }
  };

  const handleRemoveApointmentService = (item: AppointmentItem) => {
    setItemToRemove(item);
    setModalRemoveItem(true);
  };

  const handleConfirmRemove = () => {
    if (!itemToRemove) return;

    removeAppointmentItemByDateAndID(itemToRemove);
    setModalRemoveItem(false);
    setItemToRemove(null);
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
    <div
    className="px-5 md:px-20"
    >
      {modalRemoveItem && (
        <ConfirmModal
          open={modalRemoveItem}
          title={`Remover serviço ${itemToRemove?.serviceName}?`}
          onCancel={() => setModalRemoveItem(false)}
          onConfirm={handleConfirmRemove}
          colorConfirm="bg-[var(--red)]"
        />
      )}

      <div className="flex flex-col items-start gap-4">
        <IoIosArrowBack
          onClick={() => navigate(-1)}
          size={30}
          className="cursor-pointer text-[var(--textPrimary)]"
        />

        <H2Bold>Resumo do Agendamento</H2Bold>
      </div>

      {selectedAppointmentItems.length === 0 ? (
        <div
          style={{ marginTop: "0.9375rem" }}
          className="mt-4 text-center text-gray-500"
        >
          Nenhum serviço selecionado ainda.
        </div>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          {selectedAppointmentItems.map((item, index) => (
            <div
              key={item.serviceId + index}
              style={{
                marginBottom: "1rem",
                padding: "0.8rem ",
              }}
              className="
                border-2
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
                className="cursor-pointer hover:brightness-90 transition"
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
            <Button
              className=""
              onClick={handleConfirmAppointment}
              disabled={isPending}
            >
              {isPending ? "Confirmando..." : "Confirmar Agendamento"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentSummaryPage;
