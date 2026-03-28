import { type Request, type Response, type NextFunction } from 'express';
import { verifyAccessToken } from '../utils/auth.ts';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.cookies?.accessToken;
    if(!token)
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    try {
        const payload = verifyAccessToken(token);
        (req as any).user = payload; 
        next();
    } 
    catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(403).json({ message: 'Invalid token' });
    }
};