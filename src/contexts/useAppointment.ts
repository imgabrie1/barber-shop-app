import { useContext } from 'react';
import type { AppointmentContextType } from './appointment.interface';
import { AppointmentContext } from './appointment-context-obj';

export const useAppointment = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

