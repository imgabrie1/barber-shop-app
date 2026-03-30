import H2Bold from "@/components/ui/H2Bold";
import IsFeatching from "@/components/ui/IsFeatching";
import P from "@/components/ui/Span";
import { useAvailability } from "@/features/Appointments/hooks/UseCheckAvailability";
import { MdNavigateNext } from "@react-icons/all-files/md/MdNavigateNext";
import { IoIosArrowBack } from "@react-icons/all-files/io/IoIosArrowBack";
import { IoMdAddCircle } from "@react-icons/all-files/io/IoMdAddCircle";
import { IoIosArrowForward } from "@react-icons/all-files/io/IoIosArrowForward";
import { TiDelete } from "@react-icons/all-files/ti/TiDelete";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/ui/Button";

const SelectAvailabilitiesDatePage = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<1 | 2>(1);
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  //barberID
  const barberIdFromState = (location.state as { barberId?: string })?.barberId;
  const barberIdFromQuery = searchParams.get("barberId");
  const barberId = barberIdFromState || (barberIdFromQuery as string);

  //price
  const priceFromState = (location.state as { price?: string })?.price;

  const priceFromQuery = searchParams.get("price");
  const price = priceFromState || (priceFromQuery as string);

  //barberName
  const barberNameFromState = (location.state as { barberName?: string })
    ?.barberName;

  const barberNameFromQuery = searchParams.get("barberName");
  const barberName = barberNameFromState || (barberNameFromQuery as string);

  //serviceName
  const serviceNameFromState = (location.state as { serviceName?: string })
    ?.serviceName;
  const serviceNameFromQuery = searchParams.get("serviceName");
  const serviceName = serviceNameFromState || serviceNameFromQuery;

  const [currentDate, setCurrentDate] = useState(new Date());

  const getFormattedDate = (date: Date, format: "iso" | "br" = "iso") => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (format === "br") return `${day}-${month}-${year}`;
    return `${year}-${month}-${day}`;
  };

  const getDisplayDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === today.getTime()) {
      return "Hoje";
    }

    if (checkDate.getTime() === tomorrow.getTime()) {
      return "Amanhã";
    }

    const day = date.getDate();

    const month = date.toLocaleDateString("pt-BR", {
      month: "long",
    });

    const weekday = date.toLocaleDateString("pt-BR", {
      weekday: "long",
    });

    const formatted = `${weekday}, ${day} de ${month}`;

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const getFormattedDateParts = (date: Date) => {
    const day = date.getDate();

    const month = date.toLocaleDateString("pt-BR", {
      month: "long",
    });

    const weekday = date.toLocaleDateString("pt-BR", {
      weekday: "long",
    });

    return {
      day,
      month,
      weekday,
    };
  };

  const handleNextDay = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      return next;
    });
  };

  const handlePrevDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(currentDate);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() > today.getTime()) {
      setCurrentDate((prev) => {
        const back = new Date(prev);
        back.setDate(back.getDate() - 1);
        return back;
      });
    }
  };

  const isToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentDate);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() <= today.getTime();
  };

  const {
    data: times,
    isFetching: isFetchingTimes,
    error: errorTimes,
  } = useAvailability({
    date: getFormattedDate(currentDate),
    barberId,
    barberName,
  });

  if (stage === 1) {
    return (
      <div style={{ paddingLeft: "0.8rem", paddingRight: "0.8rem" }}>
        <div className="flex flex-col items-start gap-4">
          <IoIosArrowBack
            onClick={() => navigate(-1)}
            size={30}
            className="text-[var(--textPrimary)]"
            style={{ cursor: "pointer" }}
          />
          <H2Bold>Horários Disponíveis</H2Bold>
        </div>

        <div className="flex items-center gap-4" style={{ marginTop: "1rem" }}>
          <IoIosArrowBack
            size={24}
            onClick={handlePrevDay}
            style={{
              cursor: isToday() ? "default" : "pointer",
              opacity: isToday() ? 0.3 : 1,
            }}
            className="text-[var(--textPrimary)]"
          />
          <P style={{ fontSize: "1.1rem", fontWeight: "600" }}>
            {getDisplayDate(currentDate)}
          </P>
          <IoIosArrowForward
            size={24}
            onClick={handleNextDay}
            style={{ cursor: "pointer" }}
            className="text-[var(--textPrimary)]"
          />
        </div>

        {isFetchingTimes && <IsFeatching />}
        {errorTimes && (
          <P
            role="alert"
            className="text-red-500 font-semibold"
            style={{ marginTop: "1rem" }}
          >
            A barbearia Vortex e/ou o {barberName} não atenderá{" "}
            {getDisplayDate(currentDate)}
          </P>
        )}

        <div style={{ marginTop: "1rem" }}>
          {times?.length === 0 && !isFetchingTimes && (
            <P>Nenhum horário disponível para este dia.</P>
          )}
          {times?.map((time) => {
            const handleSelectTime = () => {
              setStage(2);
              setCurrentTime(time);
            };

            return (
              <div
                key={time}
                className="flex flex-col w-full"
                style={{ marginTop: "1.5rem" }}
              >
                <ul className="w-full flex flex-col gap-2">
                  <li
                    className="border-b border-white/20 flex justify-between items-center"
                    style={{ paddingBottom: "1.2rem", cursor: "pointer" }}
                    onClick={handleSelectTime}
                  >
                    <div>
                      <P>{time}</P>
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
      </div>
    );
  }
  if (stage === 2) {
    const { day, month, weekday } = getFormattedDateParts(currentDate);

    return (
      <div
        style={{
          paddingLeft: "0.6rem",
          paddingRight: "0.6rem",
        }}
        className="min-h-screen
        w-full
        "
      >
        <div
          style={{ marginBottom: "2rem" }}
          className="flex
        flex-col
        "
        >
          <div className="flex flex-col items-start gap-4">
            <IoIosArrowBack
              onClick={() => setStage(1)}
              size={30}
              className="text-[var(--textPrimary)]"
              style={{ cursor: "pointer" }}
            />
            <H2Bold>Confirmar Agendamento</H2Bold>
          </div>
          <div
            style={{ marginTop: "0.6rem", padding: "0.6rem" }}
            className="border-3 border-dotted border-[var(--textPrimary)] rounded-sm flex justify-between"
          >
            <div>
              <P style={{ textTransform: "capitalize" }}>{month}</P>
              <P style={{ fontSize: "2rem", fontWeight: "bold" }}>{day}</P>
              <P className="text-md capitalize">{weekday}</P>
              <P>{currentTime}</P>
            </div>
            <TiDelete
              className="cursor-pointer"
              size={25}
              onClick={() => console.log(`tirar ${serviceName}`)}
            />
          </div>
          <div style={{ marginTop: "1rem" }} className="flex justify-center">
            <div
              style={{ padding: "0.6rem", marginTop: "0.6rem" }}
              className="border-2 cursor-pointer border-[var(--textPrimary)] rounded-sm flex items-center justify-between w-fit gap-4"
              onClick={() => console.log("adicionar outro serviço")}
            >
              <IoMdAddCircle size={25} />
              <P>adicionar mais</P>
            </div>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <P>{serviceName}</P>
            <P>{barberName}</P>
            <P>R$: {price}</P>
          </div>
          <div>
            <P>total: {price} (por ora ta errado, vamo vendo)</P>
          </div>
        </div>
        <Button onClick={() => console.log("confirma né")}>Confirmar</Button>
      </div>
    );
  }
};

export default SelectAvailabilitiesDatePage;
