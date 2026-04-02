import { type JwtPayload } from "./auth.ts";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}