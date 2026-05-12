import z from "zod";

export const adminRevenueSchema = z.object({
  totalRevenue: z.number().optional(),
  filteredRevenue: z.number().optional(),
  global: z
    .object({
      totalRevenue: z.number(),
      filteredRevenue: z.number(),
    })
    .optional(),
  shops: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        totalRevenue: z.number(),
        filteredRevenue: z.number(),
      }),
    )
    .optional(),
});

export const createServiceSchema = z.object({
  name: z.string(),
  durationMinutes: z.number().positive(),
  price: z.number().positive(),
  defaultBarberCommissionPercentage: z.number(),
  shopId: z.string().optional(),
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


