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
  defaultBarberCommissionPercentage: z.number(),
});

export const createShopSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  businessStartHour: z.number().min(0).max(23),
  businessEndHour: z.number().min(0).max(23),
});

export const returnShopUnit = createShopSchema.extend({
  id: z.string(),
});

export const returnShopsInServices = returnShopUnit.omit({
  address: true,
  businessStartHour: true,
  businessEndHour: true,
});

export const returnMultipleShopUnits = returnShopUnit.array();

export const createServiceOutputSchema = createServiceSchema.extend({
  id: z.string(),
});

export const userByIDtoAdminViewSchema = userSchema.extend({
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
