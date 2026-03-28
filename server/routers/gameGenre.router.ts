import type { CreateGameGenresDto } from "../models/CreateGameGenresDto.ts";
import prisma from "../utils/prisma-client.ts";
import { type Request, type Response, type NextFunction, Router } from "express";

interface Params {
  gameId: string;
  gameGenreId: string | undefined;
}

const router: Router = Router();

router.post('/', async (req: Request<Params, {}, CreateGameGenresDto>, res: Response, next: NextFunction) => {
    const gameId = Number(req.params.gameId);
    const genreNames: string[] = req.body.names;

    if(isNaN(gameId))
        return res.status(400).json({message: 'Invalid gameId'});

    const game = prisma.game.findUnique({where : {id: gameId}});
    
    if(!game)
        return res.status(404).json({message: 'Game not found'});

    const genres = await Promise.all(
        genreNames.map(genreName => {
            return prisma.genre.findUnique({where: {title: genreName}});
        })
    );

    const invalidGenres = genreNames.filter(genreName => {
        let invalid = true;
        genres.forEach(g => {
            if(g?.title === genreName){
                invalid = false;
                return;
            }
        })
        return invalid;
    });

    if(invalidGenres.length > 0)
        return res.status(400).json({
            message: `Invalid genres: ${invalidGenres.join(', ')}`
        });

    await prisma.gameGenre.createMany({
        data: genres.map(g => {
                return {gameId, genreId: g!.id} //genres from db, will never be null
        }),
        //skipDuplicates: true // only after adding unique constraint
    });

});

router.delete('/:gameGenreId', async (req: Request<Params>, res: Response, next: NextFunction) => {
    const gameId = Number(req.params.gameId);
    const gameGenreId = Number(req.params.gameGenreId);

    if(isNaN(gameId))
        return res.status(400).json({message: 'Invalid gameId'});
    if(isNaN(gameGenreId))
        return res.status(400).json({message: 'Invalid gameGenreId'});

    const game = prisma.game.findUnique({where : {id: gameId}});
    
    if(!game)
        return res.status(404).json({message: 'Game not found'});

    try{
        const deleteGameGenre = await prisma.game.delete({
            where: {
                id: gameGenreId,
            }
        });

        res.status(204).json(deleteGameGenre);
    }catch(error){
        res.status(500).json({error : "Failed to delete gameGenre"});
    }
    
});

export default router;