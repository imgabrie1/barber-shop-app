import H2Bold from "@/components/ui/H2Bold";
import IsFeatching from "@/components/ui/IsFeatching";
import P from "@/components/ui/Span";
import { useServices } from "@/features/barberServices/hooks/useBarberServices";
import { MdNavigateNext } from "@react-icons/all-files/md/MdNavigateNext";
import { useState } from "react";

const DashboardPage = () => {
  const { data, isFetching, error } = useServices();
  const [stage, setStage] = useState<1 | 2>(1);
  const [service, setService] = useState<string>();

  if (stage === 1) {
    return (
      <div style={{ paddingLeft: "0.8rem", paddingRight: "0.8rem" }}>
        <H2Bold>Serviços</H2Bold>

        {isFetching ? <IsFeatching /> : null}
        {error ? <p role="alert">Erro ao buscar serviços</p> : null}
        {data
          ? data.map((service) => {
              const teste = () => {
                setService(service.name);
                setStage(2)
              };
              return (
                <div
                  key={service.id}
                  className="flex flex-col w-full"
                  style={{ marginTop: "1.5rem" }}
                >
                  <ul className="w-[100%] flex flex-col gap-2">
                    <li
                      className="
                    border-b
                    border-white/20
                    flex
                    justify-between
                    items-center
                    "
                      style={{ paddingBottom: "1.2rem" }}
                      onClick={() => teste()}
                    >
                      <div>
                        <P>{service.name}</P>
                        <P>duração média: {service.durationMinutes} minutos</P>
                        <P>R$: {service.price}</P>
                      </div>
                      <MdNavigateNext
                        style={{ color: "var(--red)" }}
                        size={30}
                      />
                    </li>
                  </ul>
                </div>
              );
            })
          : null}
      </div>
    );
  }

  if (stage === 2) {
    return (
      <div>
        <p>cliquei em: {service}</p>
        <p onClick={() => setStage(1)}>vortar</p>
      </div>
    );
  }
};
export default DashboardPage;
