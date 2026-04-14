import { z } from "zod";
import { userSchema } from "./user.schema";
import { ServiceSchema } from "./barber.schemas";

export const appointmentStatusEnum = z.enum([
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
]);

export const createAppointmentSchema = z.object({
  startTime: z.string().refine((date) => new Date(date) > new Date(), {
    message: "agendamento deve ser no futuro",
  }),

  barberId: z.string({ message: "barberId inválido" }),

  serviceIds: z
    .array(z.string({ message: "ID do serviço inválido" }))
    .min(1, "Deve ter pelo menos 1 serviço")
    .max(10, "Limite de serviços excedido"),
});

export const appointmentResponseSchema = z.object({
  id: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: appointmentStatusEnum,
  client: userSchema,
  barber: userSchema,
  services: z.array(ServiceSchema),
});

export const outputGetAppoitmentSchema = z.object({
  data: z.array(appointmentResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Horário inválido (HH:mm)");

export const timeSlotsSchema = z.array(timeSchema);
