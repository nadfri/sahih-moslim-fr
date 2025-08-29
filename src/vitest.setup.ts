// Import jest-dom matchers to extend Vitest's expect
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

import { cleanupTestData } from "@/__tests__/test-helpers";

// Mock Next.js server helpers that rely on runtime stores not present in Vitest.
// This ensures functions like revalidatePath don't throw during tests.
vi.mock("next/cache", () => ({
  revalidatePath: () => {
    /* no-op in tests */
  },
}));

// Clean up React Testing Library after each test
afterEach(() => cleanup());

// Clean up test data from database once before the test suite runs to provide a
// clean starting state. Running cleanup afterEach across parallel test files
// caused race conditions where one worker deleted records created by another.
beforeAll(async () => {
  // Detect Vitest environment instead of relying on NODE_ENV which may not be set.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isVitest = typeof (import.meta as any).vitest !== "undefined";
  if (isVitest && !process.env.SKIP_DB_CLEANUP) {
    try {
      await cleanupTestData();
    } catch (error) {
      console.warn("Failed to cleanup test data:", error);
    }
  }
});
