import { z } from "zod";
import { returnShopsInServices } from "./admin.schema";

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  durationMinutes: z.number(),
  price: z.number(),
  defaultBarberCommissionPercentage: z.number(),
  shops: returnShopsInServices.optional(),
});
