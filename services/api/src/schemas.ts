import { z } from 'zod';
export const CreateOrderSchema = z.object({
customerName: z.string().min(1),
amount: z.number().finite().nonnegative()
});
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;