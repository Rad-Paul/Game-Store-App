
export class AppError extends Error {
    success: boolean = false;
    statusCode: number;

    constructor(message: string, statusCode: number){
        super(message);
        this.statusCode = statusCode,
        Error.captureStackTrace(this, this.constructor); //reduce error clutter, hide unnecessary info   
    }
}

export class PrismaError extends AppError {
    prismaErrorCode: string;

    constructor(prismaErrorCode: string){
        super('Internal server error.', 500);
        this.prismaErrorCode = prismaErrorCode;
    }
}

export class AppZodError extends AppError {
    details: object[];
    constructor(details: object[]){
        super('Validation error', 403);
        this.details = details;
    }
}

export class GameNotFoundError extends AppError {
    constructor(id: number){
        super(`Game with id ${id} not found.`, 404);
    }
}

export class BadRequestError extends AppError {
    constructor(target: string, missingProperty: string){
        super(`${target} ${missingProperty} missing.`, 400);
    }
}