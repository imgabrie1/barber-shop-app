import type { adminRevenueSchema } from "@/schemas/admin.schema";
import type z from "zod";

export type adminRevenueInterface = z.infer<
  typeof adminRevenueSchema
>;
