import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/vitest.setup.ts"],
    coverage: {
      provider: "v8",
    },
    server: {
      deps: {
        // https://github.com/vercel/next.js/issues/77200
        inline: ["next-intl"],
      },
    },
    // Vitest 4 configuration for better test isolation
    isolate: true,
    include: ["**/*.test.{ts,tsx}"],
  },
});
