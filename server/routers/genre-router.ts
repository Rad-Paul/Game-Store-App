import { Router, type Request, type Response, type NextFunction } from "express";
import prisma from "../utils/prisma-client.ts";

const router : Router = Router();

router.get('/', async (req : Request, res : Response, next : NextFunction) => {
    const genres = await prisma?.genre.findMany();

    res.json(genres);
});

router.get('/:id', async (req : Request, res : Response, next : NextFunction) => {
    const genre = await prisma?.genre.findFirst({
        where: {
            id: Number(req.params.id),
        }
    })

    if(!genre){
        return res.status(404).json({error: 'Genre not found!'});
    }

    res.json(genre);
});

export default router;