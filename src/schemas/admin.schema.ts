import z from "zod";
import { userSchema } from "./user.schema";

export const adminRevenueSchema = z.object({
  totalRevenue: z.number().positive(),
  filteredRevenue: z.number().positive(),
});

export const createServiceSchema = z.object({
  name: z.string(),
  durationMinutes: z.number().positive(),
  price: z.number().positive(),
});

export const createServiceOutputSchema = createServiceSchema.extend({
  id: z.string()
})

export const userByIDtoAdminViewSchema = userSchema.extend({
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// export const usersToAdminViewSchema = userByIDtoAdminViewSchema.array()