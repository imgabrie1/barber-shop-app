import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  role: z.enum(["admin", "barber", "client"]).optional(),
});
