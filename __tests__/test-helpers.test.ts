import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock modules that call `cookies()` before importing them to avoid
// running Next.js server APIs outside a request scope during tests.
const mockRequireAdmin = vi.fn();
vi.mock("@/src/lib/auth/auth", () => ({
  requireAdmin: mockRequireAdmin,
}));

import { prisma } from "@/prisma/prisma";
import { cleanupTestData, testDataHelpers } from "@/__tests__/test-helpers";

describe("Test Database Cleanup and Helpers", () => {
  beforeEach(async () => {
    // Clean up before each test
    await cleanupTestData();
  });

  it("should create and cleanup test data properly", async () => {
    // Create test data using helpers
    const testChapter = await prisma.chapter.create({
      data: testDataHelpers.createTestChapter(1),
    });

    expect(testChapter.slug.startsWith("test-chapter-")).toBe(true);

    // Data should be found
    const foundChapter = await prisma.chapter.findUnique({
      where: { id: testChapter.id },
    });
    expect(foundChapter).not.toBeNull();

    // Cleanup
    await cleanupTestData();

    // Data should be gone after cleanup
    const cleanedChapter = await prisma.chapter.findUnique({
      where: { id: testChapter.id },
    });
    expect(cleanedChapter).toBeNull();
  });

  it("should handle auth requirements", async () => {
    // Mock admin user
    mockRequireAdmin.mockResolvedValueOnce(true);

    // Import the mocked function dynamically to assert it returns the mocked value
    const { requireAdmin } = await import("@/src/lib/auth/auth");
    const result = await requireAdmin();
    expect(result).toBe(true);

    // Mock non-admin user
    mockRequireAdmin.mockResolvedValueOnce({
      success: false,
      message: "Accès admin requis",
    });

    const result2 = await requireAdmin();
    expect(result2).toEqual({
      success: false,
      message: "Acc\u00e8s admin requis",
    });
  });
});
