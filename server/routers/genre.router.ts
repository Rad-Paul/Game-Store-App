import { Router, type Request, type Response, type NextFunction } from "express";
import prisma from "../utils/prisma-client.ts";
import { createGenreAsync, deleteGenreByIdAsync, getGenreByIdAsync, getGenresAsync } from "../services/genre.service.ts";
import { BadRequestError } from "../utils/error/appErrors.ts";
import type { CreateGenreDto, GenreDto } from "../validation/zod/genre.schemas.ts";

const router : Router = Router();

interface Params {
    genreId: string | undefined;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const genres = await getGenresAsync();

    res.status(200).json(genres);
});

router.get('/:id', async (req: Request<Params, {}, {}>, res: Response, next: NextFunction) => {
    const genreId: number | undefined = Number(req.params.genreId);

    if(isNaN(genreId))
        throw new BadRequestError('Genre', 'id');

    const genre: GenreDto = await getGenreByIdAsync(genreId);
    
    res.status(200).json(genre);
});

router.post('', async (req: Request<CreateGenreDto>, res: Response, next: NextFunction) => {
    const genreData: CreateGenreDto = req.body;
    
    const genre: GenreDto = await createGenreAsync(genreData);

    res.status(201).json(genre);
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const genreId: number | undefined = Number(req.params.genreId);

    if(isNaN(genreId))
        throw new BadRequestError('Genre', 'id');

    await deleteGenreByIdAsync(genreId);

    res.status(204);
});

export default router;