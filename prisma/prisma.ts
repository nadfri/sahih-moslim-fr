import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Load test environment variables BEFORE initializing Prisma if in test mode
if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test", override: true });
}

console.log("ENV=", process.env.NODE_ENV);

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Instantiate a single PrismaClient instance. In Node.js runtimes we do not
// need a driver adapter (e.g. Neon). Accelerate will handle pooling via
// the client extension if DATABASE_URL points to prisma://
const client: PrismaClient = new PrismaClient();

export const prisma =
  globalForPrisma.prisma || client.$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
