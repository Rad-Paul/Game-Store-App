import { z } from "zod";

export const createGameGenresSchema = z.object({
    titles: z.array(z.string().max(50))
});

export type CreateGameGenresDto = z.infer<typeof createGameGenresSchema>;