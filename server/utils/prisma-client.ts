import "dotenv/config";                    
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "../generated/prisma/client.ts";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL formatting is not defined in the .env file!');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaMssql(process.env.DATABASE_URL);

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter, log: ['query', 'error'] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;