import { z } from "zod";

export const OrderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  amount: z.number(),
  createdAt: z.string(),
  status: z.enum(["CREATED", "CONFIRMED", "CANCELLED"])
});
export type OrderDTO = z.infer<typeof OrderSchema>;

export const OrdersListSchema = z.array(OrderSchema);
