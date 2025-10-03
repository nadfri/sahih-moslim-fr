/**
 * Test utilities for Next.js 15 and next-intl testing
 *
 * For complete examples and templates, see __tests__/README-TESTING.md
 */

// Helper types for testing
export type TestLocale = "fr" | "en" | "ar";

// Common test data
export const TEST_LOCALES: TestLocale[] = ["fr", "en", "ar"];
export const DEFAULT_TEST_LOCALE: TestLocale = "fr";

// Mock data helpers
export const createMockParams = (locale: TestLocale = "fr") =>
  Promise.resolve({ locale });

export const createMockUser = (overrides = {}) => ({
  id: "test-user-id",
  user_metadata: { role: "user" },
  app_metadata: {},
  ...overrides,
});

export const createMockProfile = (role = "USER") => ({
  data: { role },
  error: null,
});
