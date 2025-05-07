// prisma/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Log the actual database URL used by Prisma (for debug only)
console.log(
  "Prisma actual DB URL:",
  (
    prisma as PrismaClient & {
      _engine_config?: { datasources?: { db?: { url?: string } } };
    }
  )._engine_config?.datasources?.db?.url || process.env.DATABASE_URL
);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
