import { type Request, type Response, type NextFunction } from "express";
import { ZodError } from "zod";
import { AppError, AppZodError, PrismaError } from "../utils/error/appErrors.ts";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error: any = {...err};
    error.message = err.message;   

    //prisma errors
    const errorCode: string | undefined = error.code;
    if(errorCode?.startsWith('P')){
        const prismaError: PrismaError = new PrismaError(errorCode);
        //log prisma error

        if(process.env.NODE_ENV === 'development')
            return res.status(prismaError.statusCode).json({prismaError, details: error.message})

        return res.status(prismaError.statusCode).json({prismaError})
    }

    //zod errors
    const errorName: string | undefined = error.name;
    if(errorName === 'ZodError'){
        const zodError: AppZodError = new AppZodError((error as ZodError).issues);
        return res.status(zodError.statusCode).json(zodError);
    }

    //api errors
    if(error instanceof AppError)
        return res.status(error.statusCode).json(error);

    //unknown/unexpected errors
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { 
          message: err.message,
          stack: err.stack 
        }),
    });
};