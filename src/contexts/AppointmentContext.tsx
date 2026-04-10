import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { AppointmentContext } from "./appointment-context-obj";
import type { AppointmentItem } from "./appointment.interface";
import { USER_STORAGE } from "@/services/auth.storage";
import { storage } from "@/services/storage";

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAppointmentItems, setSelectedAppointmentItems] = useState<
    AppointmentItem[]
  >([]);
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
  const [currentServiceName, setCurrentServiceName] = useState<string | null>(
    null,
  );
  const [currentServiceDuration, setCurrentServiceDuration] = useState<
    number | null
  >(null);
  const [currentBarberId, setCurrentBarberId] = useState<string | null>(null);
  const [currentBarberName, setCurrentBarberName] = useState<string | null>(
    null,
  );
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  const userId = useMemo(() => {
    try {
      const user = storage.get(USER_STORAGE);
      return user ? JSON.parse(user).id : null;
    } catch (error) {
      console.error("Failed to parse user from storage:", error);
      return null;
    }
  }, []);

  const addAppointmentItem = (item: AppointmentItem) => {
    const newAppointmentStart = item.dateTime.getTime();
    const newAppointmentEnd =
      item.dateTime.getTime() + item.durationMinutes * 60 * 1000;

    for (const existingItem of selectedAppointmentItems) {
      const existingAppointmentStart = existingItem.dateTime.getTime();
      const existingAppointmentEnd =
        existingItem.dateTime.getTime() +
        existingItem.durationMinutes * 60 * 1000;

      const isOverlapping =
        (newAppointmentStart < existingAppointmentEnd &&
          newAppointmentEnd > existingAppointmentStart) ||
        (existingAppointmentStart < newAppointmentEnd &&
          existingAppointmentEnd > newAppointmentStart);

      if (isOverlapping) {
        if (existingItem.barberId === item.barberId) {
          alert(
            "Horário conflitante com um agendamento existente para este barbeiro.",
          );
          return;
        }

        if (userId && existingItem.barberId !== item.barberId) {
          alert(
            "Você já possui um agendamento para o mesmo horário com outro barbeiro.",
          );
          return;
        }
      }
    }

    setSelectedAppointmentItems((prevItems) => [...prevItems, item]);
  };

  const clearAppointmentItems = () => {
    setSelectedAppointmentItems([]);
  };

  const removeAppointmentItemByServiceId = (serviceId: string) => {
    setSelectedAppointmentItems((prevItems) =>
      prevItems.filter((item) => item.serviceId !== serviceId),
    );
  };

  return (
    <AppointmentContext.Provider
      value={{
        selectedAppointmentItems,
        addAppointmentItem,
        clearAppointmentItems,
        currentServiceId,
        setCurrentServiceId,
        currentServiceName,
        setCurrentServiceName,
        currentServiceDuration,
        setCurrentServiceDuration,
        currentBarberId,
        setCurrentBarberId,
        currentBarberName,
        setCurrentBarberName,
        currentDateTime,
        setCurrentDateTime,
        removeAppointmentItemByServiceId,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
