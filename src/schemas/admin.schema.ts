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

export const createShopBaseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  alwaysOpen: z.boolean(),
  businessStartHour: z.union([z.number().min(0).max(23), z.nan()]).optional(),
  businessEndHour: z.union([z.number().min(0).max(23), z.nan()]).optional(),
});

export const createShopSchema = createShopBaseSchema.refine(
  (data) =>
    data.alwaysOpen ||
    (data.businessStartHour !== undefined &&
      data.businessEndHour !== undefined),
  {
    message: "Horários são obrigatórios quando não é 24h",
    path: ["businessStartHour"],
  }
);

export const returnShopUnit = createShopBaseSchema.extend({
  id: z.string(),
});

export const returnShopsInServices = returnShopUnit.omit({
  address: true,
  businessStartHour: true,
  businessEndHour: true,
  alwaysOpen: true,
});

export const returnMultipleShopUnits = returnShopUnit.array();

export const createServiceOutputSchema = createServiceSchema.extend({
  id: z.string(),
});


