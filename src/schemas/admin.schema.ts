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

export const scheduleSchema = z.object({
  id: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6),
  startHour: z.number().int().min(0).max(23).default(8),
  endHour: z.number().int().min(0).max(23).default(18),
  isOpen: z.boolean().default(true),
});

export const createShopBaseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  alwaysOpen: z.boolean(),
  schedules: z.array(scheduleSchema).optional(),
});


export const createShopSchema = createShopBaseSchema;

export const returnShopUnit = createShopBaseSchema.extend({
  id: z.string(),
});

export const returnShopsInServices = returnShopUnit.omit({
  address: true,
  schedules: true,
  alwaysOpen: true,
});

export const returnMultipleShopUnits = returnShopUnit.array();

export const createServiceOutputSchema = createServiceSchema.extend({
  id: z.string(),
});


