import type { adminRevenueSchema, createServiceOutputSchema, createServiceSchema } from "@/schemas/admin.schema";
import type z from "zod";

export type adminRevenueInterface = z.infer<typeof adminRevenueSchema>;

export type createServiceType = z.infer<typeof createServiceSchema>;
export type createServiceOutput = z.infer<typeof createServiceOutputSchema>;
