// Import jest-dom matchers to extend Vitest's expect
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { cleanupTestData } from "@/src/lib/test-helpers";

// Clean up React Testing Library after each test
afterEach(() => cleanup());

// Clean up test data from database after integration tests
afterEach(async () => {
  // Only run database cleanup in integration tests
  if (process.env.NODE_ENV === "test" && !process.env.SKIP_DB_CLEANUP) {
    try {
      await cleanupTestData();
    } catch (error) {
      console.warn("Failed to cleanup test data:", error);
    }
  }
});
