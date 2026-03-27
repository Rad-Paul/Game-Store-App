import prisma from "../utils/prisma-client.ts";
import { Router, type Response, type Request, type NextFunction } from "express";
import { type JwtPayload, generateAccessToken, generateRefreshToken, hashPassword, comparePassword, verifyRefreshToken} from "../utils/auth.ts";
import { type RegisterUserDto } from "../models/RegisterUserDto.ts";
import type { LoginUserDto } from "../models/LoginUserDto.ts";
import bcrypt from "bcryptjs";

const router : Router = Router();

router.post('/register', async (req: Request<{}, {}, RegisterUserDto>, res: Response, next: NextFunction) => {
    const userRegistrationData = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ 
            where : { email: userRegistrationData.email }
        });

        if(existingUser)
            return res.status(409).json({error: 'User already exists.'})

        const passwordHash = await hashPassword(userRegistrationData.password);

        const user = await prisma.user.create({
            data: {
                username: userRegistrationData.username, 
                email: userRegistrationData.email, 
                passwordHash
            }
        });

        res.status(201).json({message: 'User registration successful'});
    }
    catch(error){
        res.status(500).json({error: 'Internal server error'});
    }

});

router.post('/login', async (req: Request<{}, {}, LoginUserDto>, res: Response, next: NextFunction) => {
    const userLoginData = req.body;

    try {
        const user = await prisma.user.findUnique({where : {email: userLoginData.email}});

        if(!user || !comparePassword(userLoginData.password, user.passwordHash)){
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const payload : JwtPayload = { userId: user.id, email: user.email};

        const accessToken : string = generateAccessToken(payload);
        const refreshToken : string = generateRefreshToken(payload);

        const hashedRefreshToken : string = await bcrypt.hash(refreshToken, 12);
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + Number(process.env.REFRESH_TOKEN_EXPIRES_IN!));
        
        await prisma.refreshToken.create({ data: 
            {
                tokenHash: hashedRefreshToken, 
                userId: user.id, 
                expiresAt: expirationDate.toISOString()
            }
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_IN!) * 60 * 1000 // minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN!) * 24 * 60 * 60 * 1000 // days
        });

        res.json({message: 'Login successful'})
    }
    catch(error){
        res.status(500).json({message: 'Internal server error'});
    }
});

router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken)
        return res.status(401).json({message: 'No refresh token'})
    
        const payload: JwtPayload = verifyRefreshToken(refreshToken);

        const storedRefreshToken = await prisma.refreshToken.findUnique({ where: {id: payload.userId}});
        if(!storedRefreshToken)
            return res.status(403).json({ message: 'Invalid refresh token' });

        if(!await bcrypt.compare(refreshToken, storedRefreshToken.tokenHash))
            return res.status(403).json({ message: 'Invalid refresh token' });

        if(Date.now() > storedRefreshToken?.expiresAt.getMilliseconds())
            return res.status(403).json({ message: 'Expired refresh token'})

        const newAccessToken = generateAccessToken({userId: payload.userId, email: payload.email});

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV! === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_IN!) * 60 * 1000,
        });

        res.json({message: 'Token refreshed'});
    }

);

router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        const payload: JwtPayload = verifyRefreshToken(refreshToken);
        await prisma.refreshToken.deleteMany({where: {id: payload.userId}})
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({message: 'Logged out'});
});

export default router;