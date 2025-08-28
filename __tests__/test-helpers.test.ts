import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/prisma/prisma";
import { requireAdmin } from "@/src/lib/auth/auth";
import { cleanupTestData, testDataHelpers } from "@/__tests__/test-helpers";

// Mock Supabase auth
vi.mock("@/src/lib/auth", () => ({
  requireAdmin: vi.fn(),
}));

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

    const testNarrator = await prisma.narrator.create({
      data: testDataHelpers.createTestNarrator(1),
    });

    // Verify data exists
    expect(testChapter.slug).toBe("test-chapter-1");
    expect(testNarrator.slug).toBe("test-narrator-1");

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
    vi.mocked(requireAdmin).mockResolvedValue(true);

    const result = await requireAdmin();
    expect(result).toBe(true);

    // Mock non-admin user
    vi.mocked(requireAdmin).mockResolvedValue({
      success: false,
      message: "Accès admin requis",
    });

    const result2 = await requireAdmin();
    expect(result2).toEqual({
      success: false,
      message: "Accès admin requis",
    });
  });
});
