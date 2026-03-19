import H2Bold from "@/components/ui/H2Bold";
import IsFeatching from "@/components/ui/IsFeatching";
import P from "@/components/ui/Span";
import { useServices } from "@/features/barberServices/hooks/useBarbersServices";
import { MdNavigateNext } from "@react-icons/all-files/md/MdNavigateNext";
import { useNavigate } from "react-router-dom";

const SelectServicePage = () => {
  const navigate = useNavigate();

  const {
    data: services,
    isFetching: isFetchingServices,
    error: errorServices,
  } = useServices();

  return (
    <div style={{ paddingLeft: "0.8rem", paddingRight: "0.8rem" }}>
      <H2Bold>Serviços</H2Bold>

      {isFetchingServices && <IsFeatching />}
      {errorServices && <p role="alert">Erro ao buscar serviços</p>}

      {services?.map((service) => {
        const handleSelectService = () => {
          navigate(
            `/app/appointment/select-barber/${service.id}?serviceName=${encodeURIComponent(service.name)}`,
            {
              state: {
                serviceName: service.name,
              },
            },
          );
        };

        return (
          <div
            key={service.id}
            className="flex flex-col w-full"
            style={{ marginTop: "1.5rem" }}
          >
            <ul className="w-full flex flex-col gap-2">
              <li
                className="border-b border-white/20 flex justify-between items-center"
                style={{ paddingBottom: "1.2rem", cursor: "pointer" }}
                onClick={handleSelectService}
              >
                <div>
                  <P>{service.name}</P>
                  <P>duração média: {service.durationMinutes} minutos</P>
                  <P>R$: {service.price}</P>
                </div>

                <MdNavigateNext
                  className="text-[var(--textPrimary)]"
                  size={30}
                />
              </li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default SelectServicePage;
