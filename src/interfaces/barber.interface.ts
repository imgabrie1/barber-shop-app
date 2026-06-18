import { z } from "zod";
import type { ServiceSchema } from "@/schemas/barber.schemas";

export type BarberService = z.infer<typeof ServiceSchema>;

export interface PaginatedServicesInterface {
  data: BarberService[];
  total: number;
  page: number;
  limit: number;
}
