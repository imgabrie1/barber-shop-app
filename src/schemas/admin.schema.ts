import z from "zod";

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