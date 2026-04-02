import { GameNotFoundError } from "../utils/error/appErrors.ts";
import prisma from "../utils/prisma-client.ts";
import type { CreateGameDto, Game, GameDto, UpdateGameDto } from "../validation/zod/game.schemas.ts";

export async function getGameByIdAsync(id: number): Promise<GameDto>{
    const game = await prisma.game.findUnique({
        where: {
            id: Number(id),
        }
    });

    if(!game)
        throw new GameNotFoundError(id);

    const gameDto: GameDto = GameToDto(game);

    return gameDto;
}

export async function getGamesAsync(): Promise<GameDto[]>{
    const games = await prisma.game.findMany();

    const gameDtos: GameDto[] = games.map((game) => GameToDto(game))

    return gameDtos;
}

export async function createGameAsync(gameData: CreateGameDto): Promise<GameDto>{
    const newGame = await prisma.game.create({
        data: {
            title: gameData.title,
            developer: gameData.developer,
            description: gameData.description ?? null,
            price: gameData.price,
            releaseDate: new Date(gameData.releaseDate),
        }
    });

    const gameDto: GameDto = GameToDto(newGame);

    return gameDto;
}

export async function deleteGameByIdAsync(gameId: number) {
    const game: GameDto = await getGameByIdAsync(gameId);

    await prisma.game.delete({
        where: {
            id: Number(gameId),
        }
    });
}

export async function updateGameByIdAsync(gameId: number, updateData: UpdateGameDto): Promise<GameDto> {
    await getGameByIdAsync(gameId);

    const update: any = {};

    Object.entries(updateData).forEach(([key, value]) => {
        if(value){
            if(key === 'releaseDate'){
                updateData.releaseDate = new Date(value as string);
            } else{
                update[key] = value;
            }
        }
    });

    const updatedGame = await prisma.game.update({
        where: {
            id: gameId,
        },
        data: update,
    });

    const gameDto = GameToDto(updatedGame);

    return gameDto;
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