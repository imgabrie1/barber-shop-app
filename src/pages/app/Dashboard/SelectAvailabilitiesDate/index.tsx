import H2Bold from "@/components/ui/H2Bold";
import P from "@/components/ui/Span";
import { useAvailability } from "@/features/Appointments/hooks/UseCheckAvailability";
import { MdNavigateNext } from "@react-icons/all-files/md/MdNavigateNext";
import { IoIosArrowBack } from "@react-icons/all-files/io/IoIosArrowBack";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";
import { useAppointment } from "@/contexts/useAppointment";
import { IoIosArrowForward } from "react-icons/io";

const SelectAvailabilitiesDatePage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const {
    currentServiceId,
    currentServiceName,
    currentServiceDuration,
    currentBarberId,
    currentBarberName,
    addAppointmentItem,
  } = useAppointment();

  const isReady =
    !!currentServiceId &&
    !!currentBarberId &&
    !!currentServiceName &&
    !!currentBarberName &&
    !!currentServiceDuration;

  useEffect(() => {
    if (!isReady) {
      navigate("/app");
    }
  }, [isReady, navigate]);

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

    if (checkDate.getTime() === today.getTime()) return "Hoje";
    if (checkDate.getTime() === tomorrow.getTime()) return "Amanhã";

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
    isLoading: isLoadingTimes,
    isFetching: isFetchingTimes,
    error: errorTimes,
  } = useAvailability({
    date: getFormattedDate(currentDate),
    barberId: currentBarberId!,
    barberName: currentBarberName!,
    enabled: isReady,
  });

  const filteredTimes = useMemo(() => {
    if (!times) return [];

    const now = new Date();

    const isCurrentDateToday =
      currentDate.getDate() === now.getDate() &&
      currentDate.getMonth() === now.getMonth() &&
      currentDate.getFullYear() === now.getFullYear();

    if (!isCurrentDateToday) {
      return times;
    }

    return times.filter((time: string) => {
      const [hours, minutes] = time.split(":").map(Number);

      const slotDateTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
      );

      return slotDateTime.getTime() > now.getTime();
    });
  }, [times, currentDate]);

  if (!isReady) return null;

  const handleSelectTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const selectedDateTime = new Date(currentDate);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    const newAppointmentItem = {
      serviceId: currentServiceId!,
      serviceName: currentServiceName!,
      barberId: currentBarberId!,
      barberName: currentBarberName!,
      dateTime: selectedDateTime,
      durationMinutes: currentServiceDuration!,
    };

    addAppointmentItem(newAppointmentItem);
    navigate("/app/appointment/summary");
  };

  return (
    <div >
      <div className="flex flex-col items-start gap-4">
        <IoIosArrowBack
          onClick={() => navigate(-1)}
          size={30}
          className="text-[var(--textPrimary)]"
          style={{ cursor: "pointer" }}
        />
        <H2Bold>Horários Disponíveis</H2Bold>
        <P>Serviço: {currentServiceName}</P>
        <P>Barbeiro: {currentBarberName}</P>
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

      {isLoadingTimes && <IsFetchingAndLoading />}
      {isFetchingTimes && !isLoadingTimes && (
        <P style={{ fontSize: "0.8rem", opacity: 0.6 }}>Atualizando...</P>
      )}
      {errorTimes && (
        <P
          role="alert"
          className="text-red-500 font-semibold"
          style={{ marginTop: "1rem" }}
        >
          {import.meta.env.VITE_BARBER_SHOP_NAME} e/ou o {currentBarberName} não
          atenderá {getDisplayDate(currentDate)}
        </P>
      )}

      {!isLoadingTimes &&
        !isFetchingTimes &&
        !errorTimes &&
        filteredTimes.length === 0 && (
          <P
            role="alert"
            className="text-yellow-500 font-semibold"
            style={{ marginTop: "1rem" }}
          >
            Não há mais horários disponíveis para {getDisplayDate(currentDate)}
          </P>
        )}

      <div style={{ marginTop: "1rem" }}>
        {filteredTimes.map((time) => (
          <div
            key={time}
            className="flex flex-col w-full"
            style={{ marginTop: "1.5rem" }}
          >
            <ul className="w-full flex flex-col gap-2">
              <li
                className="border-b border-white/20 flex justify-between items-center"
                style={{ paddingBottom: "1.2rem", cursor: "pointer" }}
                onClick={() => handleSelectTime(time)}
              >
                <P>{time}</P>
                <MdNavigateNext
                  className="text-[var(--textPrimary)]"
                  size={30}
                />
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectAvailabilitiesDatePage;
