import {PrismaClient} from '@prisma/client';

declare global {
    // Prevent multiple Prisma Client instances in development
    var prisma: PrismaClient | undefined;
}

const prismaDB = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prismaDB;
}

export default prismaDB;
