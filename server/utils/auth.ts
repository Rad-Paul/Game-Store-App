import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const ACCESS_SECRET : String = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET : String = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_DURATION : number = Number(process.env.ACCESS_TOKEN_EXPIRES_IN!);
const REFRESH_TOKEN_DURATION : number = Number(process.env.REFRESH_TOKEN_EXPIRES_IN!);

export interface JwtPayload {
    userId: number;
    email: string;
}

export async function hashPassword(password : string) : Promise<string> {
    //salt = 12, not sure
    return await bcrypt.hash(password, 12)
}

export async function comparePassword(password : string, hash : string) : Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET as jwt.Secret, { 
    expiresIn: `${ACCESS_TOKEN_DURATION}Minutes` 
  });
};

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET as jwt.Secret, { 
    expiresIn: `${REFRESH_TOKEN_DURATION}Days` 
  });
};

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, ACCESS_SECRET as jwt.Secret);

  return decoded as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, REFRESH_SECRET as jwt.Secret);

  return decoded as JwtPayload;
};