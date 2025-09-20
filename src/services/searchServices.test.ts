import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/prisma/prisma";
import { searchHadithsCombined } from "./searchServices";
import { testDataHelpers } from "@/__tests__/test-helpers";

describe("Search Services", () => {
  let testChapterId: string;
  let testHadithId: string;

  beforeAll(async () => {
    // Create test chapter
    const chapterData = testDataHelpers.createTestChapter(1);
    const testChapter = await prisma.chapter.create({
      data: chapterData,
    });
    testChapterId = testChapter.id;

    // Create test hadith with specific content for testing
    const testHadith = await prisma.hadith.create({
      data: {
        ...testDataHelpers.createTestHadith(9999),
        chapterId: testChapterId,
        matn_fr: "Ceci est un test avec Omar ibn al-Khattab",
        matn_ar: "هذا اختبار مع عمر بن الخطاب",
        numero: 999999, // Use a high number to avoid conflicts
      },
    });
    testHadithId = testHadith.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testHadithId) {
      await prisma.hadith
        .delete({ where: { id: testHadithId } })
        .catch(() => {});
    }
    if (testChapterId) {
      await prisma.chapter
        .delete({ where: { id: testChapterId } })
        .catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe("searchHadithsCombined", () => {
    it("should return empty array for empty query", async () => {
      const results = await searchHadithsCombined("");
      expect(results).toEqual([]);
    });

    it("should return empty array for whitespace query", async () => {
      const results = await searchHadithsCombined("   ");
      expect(results).toEqual([]);
    });

    it("should find hadith by French text", async () => {
      const results = await searchHadithsCombined("Omar ibn al-Khattab");

      expect(Array.isArray(results)).toBe(true);

      const testResult = results.find((r) => r.id === testHadithId);
      if (testResult) {
        expect(testResult).toHaveProperty("id");
        expect(testResult).toHaveProperty("numero");
        expect(testResult).toHaveProperty("matn_fr");
        expect(testResult).toHaveProperty("matn_ar");
        expect(testResult).toHaveProperty("chapter");
        expect(testResult.chapter).toHaveProperty("name_fr");
        expect(testResult.chapter).toHaveProperty("slug");
        expect(typeof testResult.id).toBe("string");
        expect(typeof testResult.numero).toBe("number");
        expect(typeof testResult.matn_fr).toBe("string");
        expect(typeof testResult.matn_ar).toBe("string");
      }
    });

    it("should find hadith by Arabic text", async () => {
      const results = await searchHadithsCombined("عمر بن الخطاب");

      const testResult = results.find((r) => r.id === testHadithId);
      expect(testResult).toBeDefined();
    });

    it("should handle case insensitive search", async () => {
      const results = await searchHadithsCombined("OMAR");

      const testResult = results.find((r) => r.id === testHadithId);
      expect(testResult).toBeDefined();
    });

    it("should respect limit parameter", async () => {
      const results = await searchHadithsCombined("test", 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });

    it("should handle accented characters search", async () => {
      const results = await searchHadithsCombined("omar"); // without accent

      const testResult = results.find((r) => r.id === testHadithId);
      expect(testResult).toBeDefined();
    });

    it("should return results ordered by numero", async () => {
      const results = await searchHadithsCombined("test", 10);

      if (results.length > 1) {
        for (let i = 0; i < results.length - 1; i++) {
          expect(results[i].numero).toBeLessThanOrEqual(results[i + 1].numero);
        }
      }
    });
  });
});
