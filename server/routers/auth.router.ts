import prisma from "../utils/prisma-client.ts";
import { Router, type Response, type Request, type NextFunction } from "express";
import { type JwtPayload, generateAccessToken, generateRefreshToken, hashPassword, comparePassword} from "../utils/auth.ts";
import { type RegisterUserDto } from "../models/RegisterUserDto.ts";
import type { LoginUserDto } from "../models/LoginUserDto.ts";
import bcrypt from "bcryptjs";
import strict from "assert/strict";

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
        expirationDate.setDate(expirationDate.getDay() + Number(process.env.REFRESH_TOKEN_EXPIRES_IN!));
        
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

export default router;