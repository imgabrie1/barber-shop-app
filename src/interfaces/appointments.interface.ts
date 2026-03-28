import type { timeSchema, timeSlotsSchema } from "@/schemas/appointments.schema";
import { z } from "zod";

export type TimeInterface = z.infer<typeof timeSchema>;
export type TimeSlotsInterface = z.infer<typeof timeSlotsSchema>;
