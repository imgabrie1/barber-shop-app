import H2Bold from "@/components/ui/H2Bold";
import IsFeatching from "@/components/ui/IsFeatching";
import P from "@/components/ui/Span";
import { useBarbers } from "@/features/barberServices/hooks/useBarbers";
import { MdNavigateNext } from "@react-icons/all-files/md/MdNavigateNext";
import { IoIosArrowBack } from "@react-icons/all-files/io/IoIosArrowBack";
import {
  useNavigate,
  // useParams
} from "react-router-dom";
// import { useLocation } from "react-router-dom";

const SelectBarberPage = () => {
  const navigate = useNavigate();
  //   const { serviceId } = useParams<{ serviceId: string }>();

//   const location = useLocation();
//     const { serviceName } = location.state as { serviceName: string };

  const {
    data: barbers,
    isFetching: isFetchingBarbers,
    error: errorBarbers,
  } = useBarbers();

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

      {isFetchingBarbers ? <IsFeatching /> : null}
      {errorBarbers ? <p role="alert">Erro ao buscar barbeiros</p> : null}

      {barbers
        ? barbers.map((barber) => {
            return (
              <div
                key={barber.id}
                className="flex flex-col w-full"
                style={{ marginTop: "1.5rem" }}
              >
                <ul className="w-full flex flex-col gap-2">
                  <li
                    className="border-b border-white/20 flex justify-between items-center"
                    style={{ paddingBottom: "1.2rem" }}
                  >
                    <div>
                      <P>{barber.name}</P>
                    </div>
                    <MdNavigateNext
                      className="text-[var(--textPrimary)]"
                      style={{ cursor: "pointer" }}
                      size={30}
                    />
                  </li>
                </ul>
              </div>
            );
          })
        : null}

      {/* <p>Serviço selecionado: {serviceId}</p>
      <p>Nome do serviço: {serviceName}</p> */}
    </div>
  );
};

export default SelectBarberPage;
