import type {
  createAppointmentSchema,
  appointmentResponseSchema,
  outputGetAppoitmentSchema,
  timeSchema,
  timeSlotsSchema,
  appointmentStatusEnum,
} from "@/schemas/appointments.schema";
import { z } from "zod";

export type AppointmentStatus = z.infer<typeof appointmentStatusEnum>;
export const appointmentStatusMap: Record<
  AppointmentStatus,
  { label: string; color: string }
> = {
  pending: {
    label: "Pendente",
    color: "text-[var(--warning)]",
  },
  confirmed: {
    label: "Confirmado pelo barbeiro",
    color: "text-[var(--success)]",
  },
  completed: {
    label: "Finalizado",
    color: "text-[var(--success)]",
  },
  cancelled: {
    label: "Cancelado",
    color: "text-[var(--red)]",
  },
  no_show: {
    label: "Não compareceu",
    color: "text-[var(--no-show)]",
  },
};

export type CreateAppointmentInterface = z.infer<
  typeof createAppointmentSchema
>;
export type OutputAppoitmentInterface = z.infer<
  typeof appointmentResponseSchema
>;
export type OutputGetAppoitmentInterface = z.infer<
  typeof outputGetAppoitmentSchema
>;
export type TimeInterface = z.infer<typeof timeSchema>;
export type TimeSlotsInterface = z.infer<typeof timeSlotsSchema>;
