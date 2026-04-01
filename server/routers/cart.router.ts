import {type Request, type Response, type NextFunction, Router} from "express";
import {type JwtPayload} from "../utils/auth.ts";
import prisma from "../utils/prisma-client.ts";
import type { CreateCartItemDto } from "../validation/zod/cart.schemas.ts"; 

const router: Router = Router();

const getCart = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.user)
        return res.status(401).json({message: 'User must be logged in!'});

    const cart = await GetOrCreateCart(req.user.userId);

    res.status(200).json(cart);
};

const addToCart = async (req: Request<CreateCartItemDto>, res: Response, next: NextFunction) => {
    if(!req.user)
        return res.status(401).json({message: 'User must be logged in!'});

    const user: JwtPayload = req.user;
    const data: CreateCartItemDto = req.body;
    const cart = await GetOrCreateCart(user.userId);

    if(!data.gameId)
        return res.status(400).json({message: 'gameId is required'});
    
    const game = await prisma.game.findUnique({
        where: {id: data.gameId},
        select: {id: true, price: true}
    });

    if(!game)
        return res.status(404).json({ error: 'Game not found' });

    const keysAvailable = await prisma.gameKey.count({
        where: {gameId: game.id, status: 'AVAILABLE'}
    });

    if(keysAvailable < 1)
        return res.status(400).json({ error: 'Game unavailable' });

    if(!data.quantity)
        data.quantity = 1;

    try{
        const result = await prisma.$transaction(async (tx) => {
        const cartItem = await tx.cartItem.upsert({
                where: {
                    cartId_gameId: {
                        cartId: cart.id,
                        gameId: data.gameId
                    }
                },
                update: {
                    quantity: {
                        increment: data.quantity!
                    }
                },
                create: {
                    cartId: cart.id,
                    gameId: data.gameId,
                    quantity: data.quantity!
                }
            });

            return cartItem;
        });

        res.status(200).json({
            message: 'Item added to cart',
            cartItem: result,
        });
    }
    catch(error:any){
        res.status(500).json({message: 'Internal server error', error: error});
    }
};

export async function GetOrCreateCart(userId: number){
    const cart: any | undefined = await prisma.cart.findUnique({
        where: {userId}, 
        include: {
            cartItems: {
                include: {
                    game: true
                },
                orderBy: {
                    addedAt: 'desc'
                }
            }
        }
    });

    if(!cart){
            const newCart = await prisma.cart.upsert({
            where: {userId: userId},
            update: {},
            create: {userId: userId}
        })
        return newCart;
    } 
    else {
        return cart;
    }
}

router.get('/', getCart);
router.post('/', addToCart);

export default router;