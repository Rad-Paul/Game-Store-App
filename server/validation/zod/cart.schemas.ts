import { z } from "zod";

export const createCartItemSchema = z.object({
    gameId: z.number().int().positive(),
    quantity: z.number().positive().default(1).nullable()
});

export type CreateCartItemDto = z.infer<typeof createCartItemSchema>;