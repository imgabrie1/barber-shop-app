import { useEffect } from "react";
import H2Bold from "@/components/ui/H2Bold";
import P from "@/components/ui/Span";
import { useBarbers } from "@/features/barberServices/hooks/useBarbers";
import { MdNavigateNext } from "@react-icons/all-files/md/MdNavigateNext";
import { IoIosArrowBack } from "@react-icons/all-files/io/IoIosArrowBack";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import IsFeatchingAndLoading from "@/components/ui/IsFeatchingAndLoading";

const SelectBarberPage = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const serviceNameFromState = (location.state as { serviceName?: string })
    ?.serviceName;
  const serviceNameFromQuery = searchParams.get("serviceName");

  const serviceName = serviceNameFromState || serviceNameFromQuery;

  const priceFromState = (location.state as { price?: string })?.price;
  const priceFromQuery = searchParams.get("price");

  const price = priceFromState || priceFromQuery;

  const {
    data: barbers,
    isFetching: isFetchingBarbers,
    error: errorBarbers,
  } = useBarbers();

  useEffect(() => {
    if (!serviceName) {
      navigate("/app");
    }
  }, [serviceName, navigate]);

  if (!serviceName) return null;

  return (
    <div style={{ paddingLeft: "0.8rem", paddingRight: "0.8rem" }}>
      <div className="flex flex-col items-start gap-4">
        <IoIosArrowBack
          onClick={() => navigate(-1)}
          size={30}
          className="text-[var(--textPrimary)]"
          style={{ cursor: "pointer" }}
        />
        <H2Bold>Barbeiros</H2Bold>
      </div>

      {isFetchingBarbers && <IsFeatchingAndLoading />}
      {errorBarbers && <p role="alert">Erro ao buscar barbeiros</p>}

      {barbers?.map((barber) => {
        const handleSelectBarber = () => {
          navigate(
            `/app/appointment/select-availabilityDate/?serviceName=${encodeURIComponent(serviceName as string)}&price=${price}&barberId=${barber.id}&barberName=${encodeURIComponent(barber.name)}`,
            {
              state: {
                barberName: barber.name,
                barberId: barber.id,
                serviceName,
                serviceId,
                price,
              },
            },
          );
        };

        return (
          <div
            key={barber.id}
            className="flex flex-col w-full"
            style={{ marginTop: "1.5rem" }}
          >
            <ul className="w-full flex flex-col gap-2">
              <li
                className="border-b border-white/20 flex justify-between items-center"
                style={{ paddingBottom: "1.2rem", cursor: "pointer" }}
                onClick={handleSelectBarber}
              >
                <div>
                  <P>{barber.name}</P>
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

      <p>Serviço selecionado: {serviceId}</p>
      <p>Nome do serviço: {serviceName}</p>
    </div>
  );
};

export default SelectBarberPage;
