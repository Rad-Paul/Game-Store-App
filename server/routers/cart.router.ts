import {type Request, type Response, type NextFunction, Router} from "express";
import {type JwtPayload} from "../utils/auth.ts";
import prisma from "../utils/prisma-client.ts";
import type { CreateCartItemDto } from "../models/CreateCartItemDto.ts";

const router: Router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    if(!(req as any).user)
        return res.status(401).json({message: 'User must be logged in!'});

    const user: JwtPayload = (req as any).user;
    const cart = await GetOrCreateCart(user.userId);

    res.status(200).json(cart);

});

router.post('/', async (req: Request<CreateCartItemDto>, res: Response, next: NextFunction) => {
    if(!(req as any).user)
        return res.status(401).json({message: 'User must be logged in!'});

    const user: JwtPayload = (req as any).user;
    const data: CreateCartItemDto = req.body;
    const cart = GetOrCreateCart(user.userId);

});

export async function GetOrCreateCart(userId: number){
    const cart: any | undefined = prisma.cart.findUnique({where: {userId : userId}, include: {cartItems: true}});

    if(!cart){
            const newCart = await prisma.cart.upsert({
            where: { userId: userId},
            update: {},
            create: { userId: userId}
        })

        return newCart;
    } 
    else {
        return cart;
    }
}

export default router;