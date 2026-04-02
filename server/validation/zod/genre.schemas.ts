import { z } from "zod";

const genreModelSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().max(50).min(1)
});

const genreSchema = genreModelSchema.omit({
    id: true,
});

export type Genre = z.infer<typeof genreModelSchema>;
export type GenreDto = z.infer<typeof genreSchema>;
export type CreateGenreDto = z.infer<typeof genreSchema>;