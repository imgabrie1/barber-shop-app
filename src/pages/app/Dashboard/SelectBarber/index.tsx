import { useEffect } from "react";
import H2Bold from "@/components/ui/H2Bold";
import P from "@/components/ui/Span";
import { useBarbers } from "@/features/barberServices/hooks/useBarbers";
import { MdNavigateNext } from "@react-icons/all-files/md/MdNavigateNext";
import { IoIosArrowBack } from "@react-icons/all-files/io/IoIosArrowBack";
import { useNavigate } from "react-router-dom";
import { useAppointment } from "@/contexts/useAppointment";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";

const SelectBarberPage = () => {
  const navigate = useNavigate();

  const { currentServiceId, setCurrentBarberId, setCurrentBarberName } =
    useAppointment();

  const {
    data: barbers,
    isFetching: isFetchingBarbers,
    error: errorBarbers,
  } = useBarbers();

  useEffect(() => {
    if (!currentServiceId) {
      navigate("/app");
    }
  }, [currentServiceId, navigate]);

  if (!currentServiceId) return null;

  return (
    <div>
      <div className="flex flex-col items-start gap-4">
        <IoIosArrowBack
          onClick={() => navigate(-1)}
          size={30}
          className="text-[var(--textPrimary)] cursor-pointer"
        />
        <H2Bold>Barbeiros</H2Bold>
      </div>

      {isFetchingBarbers && <IsFetchingAndLoading />}
      {errorBarbers && <p role="alert">Erro ao buscar barbeiros</p>}

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4"
        style={{ marginTop: "24px" }}
      >
        {barbers?.map((barber) => {
          const handleSelectBarber = () => {
            setCurrentBarberId(barber.id);
            setCurrentBarberName(barber.name);
            navigate(`/app/appointment/select-availabilityDate`);
          };

          return (
            <div
              key={barber.id}
              onClick={handleSelectBarber}
              className="flex justify-between items-center cursor-pointer border-white/20 border-b md:border md:rounded-lg"
              style={{
                paddingBottom: "19.2px",
                padding: window.innerWidth >= 768 ? "19.2px" : undefined,
              }}
            >
              <div>
                <P>{barber.name}</P>
              </div>

              <MdNavigateNext className="text-[var(--textPrimary)] md:hidden " size={30} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectBarberPage;
