import type {
  createAppointmentSchema,
  outputAppoitmentSchema,
  timeSchema,
  timeSlotsSchema,
} from "@/schemas/appointments.schema";
import { z } from "zod";

export type CreateAppointmentInterface = z.infer<
  typeof createAppointmentSchema
>;
export type OutputAppoitmentInterface = z.infer<typeof outputAppoitmentSchema>;
export type TimeInterface = z.infer<typeof timeSchema>;
export type TimeSlotsInterface = z.infer<typeof timeSlotsSchema>;
