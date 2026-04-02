import { Router, type Response, type Request, type NextFunction } from "express";
import prisma from "../utils/prisma-client.ts";
import { createGameAsync, deleteGameByIdAsync, getGameByIdAsync, getGamesAsync, updateGameByIdAsync } from "../services/game.service.ts";
import type { CreateGameDto, GameDto, UpdateGameDto } from "../validation/zod/game.schemas.ts";
import { BadRequestError } from "../utils/error/appErrors.ts";

const router : Router = Router();

interface Params {
    gameId: string;
}

router.get('/', async (req : Request, res : Response, next : NextFunction) => {
    const games: GameDto[] = await getGamesAsync();

    res.status(200).json(games);
});

router.get('/:id', async (req : Request<Params, {}, {}>, res : Response, next : NextFunction) => {
    const gameId: number | undefined = Number(req.params.gameId);

    if(isNaN(gameId))
        throw new BadRequestError('Game', 'id');

    const game: GameDto = await getGameByIdAsync(gameId);

    res.status(200).json(game);
});

router.post('/', async (req : Request<CreateGameDto>, res : Response, next : NextFunction) => {
    const gameData: CreateGameDto = req.body;

    const game: GameDto = await createGameAsync(gameData);

    res.status(201).json(game);
});

router.delete('/:id', async (req : Request, res : Response, next : NextFunction) => {
    const gameId: number | undefined = Number(req.params.gameId);

    if(isNaN(gameId))
        throw new BadRequestError('Game', 'id');

    await deleteGameByIdAsync(gameId);

    res.status(204);
});

router.put('/:id', async (req : Request<Params, {}, UpdateGameDto>, res : Response, next: NextFunction) => {
    const gameId: number | undefined = Number(req.params.gameId);

    if(isNaN(gameId))
        throw new BadRequestError('Game', 'id');

    if(Object.entries(req.body).length === 0)
        throw new BadRequestError('Update', 'body');

    const game: GameDto = await updateGameByIdAsync(gameId, req.body);

    res.status(200).json(game);
});

export default router;