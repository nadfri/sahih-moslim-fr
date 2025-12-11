import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

// Load test environment variables BEFORE initializing Prisma if in test mode
if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test", override: true });
}

console.log("ENV=", process.env.NODE_ENV);

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// In Prisma 7, adapters are required for PostgreSQL connections
// Use DATABASE_URL (pooled connection via Supabase) for queries
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const client: PrismaClient = new PrismaClient({ adapter });

export const prisma =
  globalForPrisma.prisma || client.$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
