import type {
  adminRevenueSchema,
  createServiceOutputSchema,
  createServiceSchema,
  createShopSchema,
  returnMultipleShopUnits,
  returnShopUnit,
} from "@/schemas/admin.schema";
import type { paginatedUsersSchema, userByIDtoAdminViewSchema } from "@/schemas/user.schema";
import type z from "zod";

export type adminRevenueInterface = z.infer<typeof adminRevenueSchema>;

export type createServiceType = z.infer<typeof createServiceSchema>;
export type createServiceOutput = z.infer<typeof createServiceOutputSchema>;
export type createShopType = z.infer<typeof createShopSchema>;

export type ShopUnitOutput = z.infer<typeof returnShopUnit>;
export type MultipleShopUnitsOutput = z.infer<typeof returnMultipleShopUnits>;

export interface ShopUnity extends createShopType {
  id: string;
}
export type userByIDtoAdminViewInterface = z.infer<
  typeof userByIDtoAdminViewSchema
>;

export type PaginatedUsersInterface = z.infer<typeof paginatedUsersSchema>
