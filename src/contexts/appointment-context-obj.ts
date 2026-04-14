import { createContext } from 'react';
import type { AppointmentContextType } from './appointment.interface';

export const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);
