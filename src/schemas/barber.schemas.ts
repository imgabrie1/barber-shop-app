import { z } from "zod";

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  durationMinutes: z.number(),
  price: z.number(),
});
