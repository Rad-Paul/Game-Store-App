import { title } from "process";
import type { Genre } from "../generated/prisma/client.ts";
import prisma from "../utils/prisma-client.ts";
import type { CreateGenreDto, GenreDto } from "../validation/zod/genre.schemas.ts";
import { GenreNotFoundError } from "../utils/error/appErrors.ts";

export async function getGenresAsync(): Promise<GenreDto[]> {
    const genres = await prisma.genre.findMany();

    const genreDtos: GenreDto[] = genres.map((genre) => genreToDto(genre));

    return genreDtos;
};

export async function getGenreByIdAsync(genreId: number): Promise<GenreDto> {
    const genre = await prisma.genre.findUnique({
        where: {
            id: genreId
        }
    });

    if(!genre)
        throw new GenreNotFoundError(genreId);

    const genreDto: GenreDto = genreToDto(genre);

    return genreDto;
}

export async function createGenreAsync(genreData: CreateGenreDto): Promise<GenreDto> {
    const genre = await prisma.genre.create({
        data: {
            title: genreData.title,
        }
    });

    const genreDto: GenreDto = genreToDto(genre);

    return genreDto;
};

export async function deleteGenreByIdAsync(genreId: number) {
    await getGenreByIdAsync(genreId);

    await prisma.genre.delete({
        where: {
            id: genreId,
        }
    });
};

function genreToDto(genre: Genre){
    const genreDto = {
        title: genre.title
    };

    return genreDto;
};