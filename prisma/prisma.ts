import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Load test environment variables if in test mode
if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const connectionString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? "";

let client: PrismaClient;

if (process.env.NODE_ENV === "test") {
  // For tests, use standard PostgreSQL client without adapter
  client = new PrismaClient();
} else {
  // For development and production (Supabase), use Neon adapter
  const adapter = new (await import("@prisma/adapter-neon")).PrismaNeon({
    connectionString,
  });
  client = new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma || client.$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
