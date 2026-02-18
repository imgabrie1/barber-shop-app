import { z } from "zod";
import type { ServiceSchema } from "@/schemas/barber.schemas";

export type BarberService = z.infer<typeof ServiceSchema>;
