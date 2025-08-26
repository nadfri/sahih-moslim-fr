import { PrismaNeonHTTP } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Edge-compatible Prisma client for middleware and edge functions
export function createEdgePrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for edge Prisma client");
  }

  // Use the HTTP adapter in edge environments (no WebSocket constructor available)
  // PrismaNeonHTTP expects the connection string as the first argument.
  // pass an empty options object as second argument to match adapter signature
  const adapter = new PrismaNeonHTTP(process.env.DATABASE_URL, {});

  // @ts-expect-error - Adapter type compatibility will be resolved in future Prisma versions
  return new PrismaClient({ adapter });
}

// Note: do not create a singleton at module import time. Call createEdgePrisma()
// lazily from Edge code to avoid initialization errors during bundling.
