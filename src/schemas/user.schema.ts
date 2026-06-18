import { z } from "zod";
import { returnShopsInServices } from "./admin.schema";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  role: z.enum(["admin", "barber", "client", "manager"]).optional(),
  commissionPercentage: z.number().optional(),
  shop: returnShopsInServices.optional(),
});

export const userByIDtoAdminViewSchema = userSchema.extend({
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedUsersSchema = z.object({
  data: z.array(userByIDtoAdminViewSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});


export const userByIDtoAdminViewSchema = userSchema.extend({
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});