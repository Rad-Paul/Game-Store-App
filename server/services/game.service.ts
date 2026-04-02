import { GameNotFoundError } from "../utils/error/appErrors.ts";
import prisma from "../utils/prisma-client.ts";
import type { Game, GameDto } from "../validation/zod/game.schemas.ts";

export async function getGame(id: number): Promise<GameDto>{
    const game = await prisma.game.findFirst({
        where: {
            id: Number(id),
        }
    });

    if(!game)
        throw new GameNotFoundError(id);

    const gameDto: GameDto = GameToDto(game);

    return gameDto;
}

export async function getGames(): Promise<GameDto[]>{
    const games = await prisma.game.findMany();

    const gameDtos: GameDto[] = games.map((game) => GameToDto(game))

    return gameDtos;
}

function GameToDto(game: Game): GameDto{
    const gameDto: GameDto = {
        id: game.id,
        title: game.title,
        price: game.price,
        developer: game.developer,
        description: game.description ?? null,
        releaseDate: game.releaseDate
    };

    return gameDto;
}