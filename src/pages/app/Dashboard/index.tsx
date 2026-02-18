import H2Bold from "@/components/ui/H2Bold";
import IsFeatching from "@/components/ui/IsFeatching";
import P from "@/components/ui/Span";
import { useServices } from "@/features/barberServices/hooks/useBarberServices";

const DashboardPage = () => {
  const { data, isFetching, error } = useServices();

  return (
    <div>
      <H2Bold>Serviços</H2Bold>

      {isFetching ? <IsFeatching /> : null}
      {error ? <p role="alert">Erro ao buscar serviços</p> : null}
      {data
        ? data.map((service) => {
            return (
              <div
                key={service.id}
                className="flex flex-col w-[100vw]"
                style={{ marginTop: "1.5rem" }}
              >
                <ul className="w-[100%] flex flex-col gap-2">
                  <li>
                    <P>{service.name}</P>
                    <P>R$: {service.price}</P>
                    <P>duração média: {service.durationMinutes} minutos</P>
                  </li>
                </ul>
              </div>
            );
          })
        : null}
    </div>
  );
};
export default DashboardPage;
