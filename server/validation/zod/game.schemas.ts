import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/client";

const decimalFlexible = z.union([
  z.number(),
  z.string(),
  z.instanceof(Decimal),
]).transform((val) => new Decimal(val));

const gameModelSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().max(200),
    developer: z.string().max(200),
    description: z.string().max(1000).nullable(),
    releaseDate: z.date(),
    registeredAt: z.date().readonly(),
    price: decimalFlexible//z.number().positive().or(z.string())
});

const gameSchema = gameModelSchema.omit({
    registeredAt: true,
});

const createGameSchema = gameSchema.omit({
    id: true,
});

const updateGameSchema = createGameSchema.partial();

export type Game = z.infer<typeof gameModelSchema>;
export type GameDto = z.infer<typeof gameSchema>;
export type CreateGameDto = z.infer<typeof createGameSchema>;
export type UpdateGameDto = z.infer<typeof updateGameSchema>;