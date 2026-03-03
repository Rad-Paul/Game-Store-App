import { Router, type Response, type Request, type NextFunction } from "express";
import prisma from "../utils/prisma-client.ts";
import type { CreateGameDto } from "../models/CreateGameDto.ts";
import type { UpdateGameDto } from "../models/UpdateGameDto.ts";
import { error } from "console";

const router : Router = Router();

router.get('/', async (req : Request, res : Response, next : NextFunction) => {
    const games = await prisma?.game.findMany();

    res.json(games);
});

router.get('/:id', async (req : Request, res : Response, next : NextFunction) => {
    const game = await prisma?.game.findFirst({
        where: {
            id: Number(req.params.id),
        }
    });

    if(!game){
        return res.status(404).json({ error: 'Game not found'});
    }

    res.json(game);
});

router.post('/', async (req : Request<{}, {}, CreateGameDto>, res : Response, next : NextFunction) => {
    const gameData = req.body;

    try {
        const newGame = await prisma.game.create({
            data: {
                Title: gameData.title,
                Developer: gameData.developer,
                Description: gameData.description,
                releaseDate: new Date(gameData.releaseDate),
            }
        })

        res.status(201).json(newGame);
    } catch(error: any){
        console.error(error);
        res.status(500).json({error: 'Failed to create game'});
    }
})

router.delete('/:id', async (req : Request, res : Response, next : NextFunction) => {

    try{
        const deleteGame = await prisma.game.delete({
            where: {
                id: Number(req.params.id),
            }
        })

        res.status(204).json(deleteGame);
    }
    catch(error : any){
        res.status(500).json({error : "Failed to delete game"});
    }
})

router.put('/:id', async (req : Request, res : Response, next: NextFunction) => {

    const game : any = await prisma.game.findUnique({
        where: {
            id: Number(req.params.id),
        }
    });

    if(!game)
        res.status(404).json({error : 'Game not found'});

    const updateData: any = {};

    try{
        Object.entries(req.body).forEach(([key, value]) => {
            if(value){
                if(key === 'releaseDate'){
                    updateData.releaseDate = new Date(value as string);
                } else{
                    updateData[key] = value;
                }
            }
        });

        const updatedGame = await prisma.game.update({
            where: {
                id: Number(req.params.id),
            },
            data: updateData,
        });

        res.status(200).json(updatedGame);

    } catch (error : any) {
        res.status(500).json({error : 'Failed to update game'})
    }

})

export default router;