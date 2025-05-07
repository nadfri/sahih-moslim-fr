import react from "@vitejs/plugin-react";
import { config as dotenvConfig } from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

dotenvConfig({ path: "./.env.test" });

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true, // Optional: Enables global APIs like describe, it, expect
    environment: "jsdom",
    // Add this line to run the setup file before tests
    setupFiles: ["src/vitest.setup.ts"],
    coverage: {
      provider: "v8",
    },
  },
});
