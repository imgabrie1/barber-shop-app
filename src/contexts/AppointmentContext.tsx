import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { AppointmentContext } from './appointment-context-obj'; // Import AppointmentContext from its dedicated file
import type { AppointmentItem } from './appointment.interface';

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAppointmentItems, setSelectedAppointmentItems] = useState<AppointmentItem[]>([]);
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
  const [currentServiceName, setCurrentServiceName] = useState<string | null>(null);
  const [currentBarberId, setCurrentBarberId] = useState<string | null>(null);
  const [currentBarberName, setCurrentBarberName] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  const addAppointmentItem = (item: AppointmentItem) => {
    setSelectedAppointmentItems((prevItems) => [...prevItems, item]);
  };

  const clearAppointmentItems = () => {
    setSelectedAppointmentItems([]);
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
        currentBarberId,
        setCurrentBarberId,
        currentBarberName,
        setCurrentBarberName,
        currentDateTime,
        setCurrentDateTime,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
