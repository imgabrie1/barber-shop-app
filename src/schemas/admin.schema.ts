import z from "zod";

export const adminRevenueSchema = z.object({
  totalRevenue: z.number().positive(),
  filteredRevenue: z.number().positive(),
});
