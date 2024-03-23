import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma || new PrismaClient({ transactionOptions: { maxWait: 5000, timeout: 20000 } });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
