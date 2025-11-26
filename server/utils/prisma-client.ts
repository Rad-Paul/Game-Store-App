import { PrismaClient } from "@prisma/client";

const globalRef : any = globalThis;

let prisma : PrismaClient | undefined = undefined;

if(globalRef.prisma)
    prisma = globalRef.prisma;
else
    prisma = new PrismaClient();

//if (process.env.NODE_ENV !== "production") globalRef.prisma = prisma;

if(!prisma){
    console.error('Failed to create prisma client!');
    process.exitCode = 1;
}
    

export default prisma;