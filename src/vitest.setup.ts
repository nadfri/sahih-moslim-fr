// Import jest-dom matchers to extend Vitest's expect
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, vi } from "vitest";
import React from "react";

import { cleanupTestData } from "@/__tests__/test-helpers";

// Load test environment variables
import { config } from "dotenv";
config({ path: ".env.test" });

// Mock Next.js server helpers that rely on runtime stores not present in Vitest.
// This ensures functions like revalidatePath don't throw during tests.
vi.mock("next/cache", () => ({
  revalidatePath: () => {
    /* no-op in tests */
  },
}));

// Mock next-intl server functions
vi.mock("next-intl/server", () => ({
  // In tests, return the key as-is for simplicity
  getTranslations: vi.fn(() => (key: string) => key),
  // Provide minimal locale utilities
  getLocale: vi.fn(() => "fr"),
  getMessages: vi.fn(() => ({})),
  getNow: vi.fn(() => new Date()),
  getTimeZone: vi.fn(() => "Europe/Paris"),
  // Ensure setRequestLocale exists for server components using next-intl
  setRequestLocale: vi.fn(),
}));

// Mock next-intl client functions
vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
  };
});

// Mock next/link component
vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement(
      "a",
      { ...props, "data-testid": "mock-link" },
      children
    ),
}));

// Mock next-intl navigation helpers
vi.mock("@/src/i18n/navigation", () => ({
  Link: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement(
      "a",
      { ...props, "data-testid": "mock-link" },
      children
    ),
  redirect: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
}));

// Provide a lightweight mock for `next/navigation` used by app-router hooks
// This prevents errors like "invariant expected app router to be mounted" in tests.
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
    notFound: () => {
      // throw to mimic next/navigation behavior when needed in tests
      throw new Error("notFound called");
    },
    redirect: vi.fn(() => {
      throw new Error("redirect called");
    }),
    permanentRedirect: vi.fn(() => {
      throw new Error("permanentRedirect called");
    }),
  };
});

// Clean up React Testing Library after each test
afterEach(() => cleanup());

// Clean up test data before each test to ensure isolation
beforeEach(async () => {
  // Detect Vitest environment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isVitest = typeof (import.meta as any).vitest !== "undefined";

  if (isVitest) {
    try {
      await cleanupTestData();
    } catch (error) {
      console.warn("Failed to cleanup test data in beforeEach:", error);
    }
  }
});

// Clean up test data from database once before the test suite runs to provide a
// clean starting state. Running cleanup afterEach across parallel test files
// caused race conditions where one worker deleted records created by another.
beforeAll(async () => {
  // Detect Vitest environment instead of relying on NODE_ENV which may not be set.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isVitest = typeof (import.meta as any).vitest !== "undefined";

  // Always perform test DB cleanup when running under Vitest.
  // The cleanup function itself has a safety gate to avoid running in production
  // unless explicitly allowed via ALLOW_LARGE_CLEANUP=true.
  if (isVitest) {
    try {
      await cleanupTestData();
    } catch (error) {
      console.warn("Failed to cleanup test data:", error);
    }
  }
});
