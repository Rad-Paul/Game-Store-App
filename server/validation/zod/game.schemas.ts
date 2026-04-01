import { z } from "zod";

export const createGameSchema = z.object({
    title: z.string().max(200),
    developer: z.string().max(200),
    description: z.string().max(1000),
    releaseDate: z.date(),
    price: z.number().positive().or(z.string())
});

export const updateGameSchema = createGameSchema.partial();

export type CreateGameDto = z.infer<typeof createGameSchema>;
export type UpdateGameDto = z.infer<typeof updateGameSchema>;