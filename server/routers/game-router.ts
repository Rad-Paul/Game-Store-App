import type { PrismaClient } from "@prisma/client/extension";
import { Router } from "express";
import prisma from "../utils/prisma-client.js";

const router : Router = Router();



router.get('/', (req, res, next) => {
    const games = prisma?.game.findMany();

    res.json(games);
});

router.get('/:id', (req, res, next) => {

    const game = prisma?.game.findFirst({
        where: {
            id: Number(req.params.id),
        }
    });

    if(!game){
        res.statusCode = 404;
        return res.status(404).json({ error: 'Game not found'});
    }

    res.json(game);
});

export default router;