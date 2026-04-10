import { z } from "zod";

export const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Horário inválido (HH:mm)");

export const timeSlotsSchema = z.array(timeSchema);
