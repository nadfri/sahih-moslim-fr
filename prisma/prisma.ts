import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

// Load test environment variables if in test mode
if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Use Neon adapter when available
const connectionString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? "";
const adapter = new PrismaNeon({ connectionString });

const client = new PrismaClient({ adapter });

export const prisma =
  globalForPrisma.prisma || client.$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
