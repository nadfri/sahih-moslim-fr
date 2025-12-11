import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Schema location
  schema: "prisma/schema.prisma",

  // Migrations configuration
  migrations: {
    path: "prisma/migrations",
  },

  // Database URL configuration
  // For Supabase: use pooled connection for migrations
  datasource: {
    url: env("DATABASE_URL"), // Use direct URL for migrations (not pooled)
    shadowDatabaseUrl: env("SHADOW_DATABASE_URL"), // Shadow DB for tests
  },
});
