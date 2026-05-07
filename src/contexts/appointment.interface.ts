export interface AppointmentItem {
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  shopId: string;
  shopName: string;
  dateTime: Date;
  durationMinutes: number;
}

export interface AppointmentContextType {
  selectedAppointmentItems: AppointmentItem[];
  addAppointmentItem: (item: AppointmentItem) => void;
  clearAppointmentItems: () => void;
  currentServiceId: string | null;
  setCurrentServiceId: (id: string | null) => void;
  currentServiceName: string | null;
  setCurrentServiceName: (name: string | null) => void;
  currentServiceDuration: number | null;
  setCurrentServiceDuration: (duration: number | null) => void;
  currentShopId: string | null;
  setCurrentShopId: (id: string | null) => void;
  currentShopName: string | null;
  setCurrentShopName: (name: string | null) => void;
  currentBarberId: string | null;
  setCurrentBarberId: (id: string | null) => void;
  currentBarberName: string | null;
  setCurrentBarberName: (name: string | null) => void;
  currentDateTime: Date | null;
  setCurrentDateTime: (dateTime: Date | null) => void;
  removeAppointmentItemByDateAndID: (target: AppointmentItem) => void;
}
