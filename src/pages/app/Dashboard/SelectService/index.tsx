import H2Bold from "@/components/ui/H2Bold";
import P from "@/components/ui/Span";
import { useServices } from "@/features/barberServices/hooks/useBarbersServices";
import { MdNavigateNext } from "@react-icons/all-files/md/MdNavigateNext";
import { useNavigate } from "react-router-dom";
import { useAppointment } from "@/contexts/useAppointment";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const SelectServicePage = () => {
  const navigate = useNavigate();
  const {
    setCurrentServiceId,
    setCurrentServiceName,
    setCurrentServiceDuration,
  } = useAppointment();

  const {
    data: services,
    isFetching: isFetchingServices,
    error: errorServices,
  } = useServices();

  return (
    <div>
      <H2Bold>Serviços</H2Bold>

      {isFetchingServices && <IsFetchingAndLoading />}
      {errorServices && <ErrorMessage isMissing="serviços" />}

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4"
        style={{ marginTop: "24px" }}
      >
        {services?.map((service) => {
          const handleSelectService = () => {
            setCurrentServiceId(service.id);
            setCurrentServiceName(service.name);
            setCurrentServiceDuration(service.durationMinutes);
            navigate(
              `/app/appointment/select-barber/${service.id}?price=${service.price}`,
              {
                state: {
                  price: service.price,
                },
              },
            );
          };

          return (
            <div
              key={service.id}
              onClick={handleSelectService}
              className="flex p-3 justify-between items-center cursor-pointer border-white/20 border-b md:border md:rounded-lg"
            >
              <div>
                <P>{service.name}</P>
                <P>duração média: {service.durationMinutes} minutos</P>
                <P>R$: {service.price}</P>
              </div>

              <MdNavigateNext
                className="text-[var(--textPrimary)] md:hidden "
                size={30}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectServicePage;
