import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Edge-compatible Prisma client for middleware and edge functions
export function createEdgePrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for edge Prisma client");
  }

  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });

  // @ts-expect-error - Adapter type compatibility will be resolved in future Prisma versions
  return new PrismaClient({ adapter });
}

// Use this in middleware and edge functions
export const edgePrisma = createEdgePrisma();
