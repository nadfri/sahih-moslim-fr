import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { prisma } from "@/prisma/prisma";
import { searchHadithsCombined } from "@/src/services/searchServices";
import { testDataHelpers } from "./test-helpers";

describe("Performance Optimization Tests", () => {
  let testChapterId: string;
  let testHadithIds: string[] = [];

  beforeAll(async () => {
    // Create test chapter
    const chapterData = testDataHelpers.createTestChapter(998);
    const testChapter = await prisma.chapter.create({
      data: chapterData,
    });
    testChapterId = testChapter.id;

    // Create multiple test hadiths to simulate realistic data volume
    const promises = [];
    for (let i = 0; i < 20; i++) {
      promises.push(
        prisma.hadith.create({
          data: {
            ...testDataHelpers.createTestHadith(9900 + i),
            chapterId: testChapterId,
            matn_fr: `Hadith français ${i} avec du contenu de test assez long pour simuler un vrai hadith`,
            matn_ar: `حديث عربي ${i} مع محتوى اختبار طويل نسبيًا لمحاكاة حديث حقيقي`,
            matn_en: `English hadith ${i} with fairly long test content to simulate a real hadith`,
          },
        })
      );
    }

    const hadiths = await Promise.all(promises);
    testHadithIds = hadiths.map((h) => h.id);
  });

  afterAll(async () => {
    // Clean up test data
    if (testHadithIds.length > 0) {
      await prisma.hadith.deleteMany({
        where: { id: { in: testHadithIds } },
      });
    }
    if (testChapterId) {
      await prisma.chapter.delete({ where: { id: testChapterId } });
    }
  });

  it("should perform optimized search for Arabic locale (AR only)", async () => {
    const startTime = performance.now();
    const results = await searchHadithsCombined("حديث", "ar", 50);
    const endTime = performance.now();

    expect(results.length).toBeGreaterThan(0);
    expect(endTime - startTime).toBeLessThan(500); // Should be under 500ms

    // Verify that only Arabic content is meaningful (FR/EN should be empty)
    results.forEach((result) => {
      expect(result.matn_ar).toBeTruthy();
      expect(result.matn_fr).toBe(""); // Should be empty for AR locale
      expect(result.matn_en).toBe(""); // Should be empty for AR locale
    });

    console.log(`Arabic search took: ${endTime - startTime}ms`);
  });

  it("should perform optimized search for French locale (FR+AR)", async () => {
    const startTime = performance.now();
    const results = await searchHadithsCombined("test", "fr", 50);
    const endTime = performance.now();

    expect(results.length).toBeGreaterThan(0);
    expect(endTime - startTime).toBeLessThan(500); // Should be under 500ms

    // Verify that FR and AR content is present, EN should be empty
    results.forEach((result) => {
      expect(result.matn_ar).toBeTruthy();
      expect(result.matn_fr).toBeTruthy();
      expect(result.matn_en).toBe(""); // Should be empty for FR locale
    });

    console.log(`French search took: ${endTime - startTime}ms`);
  });

  it("should perform optimized search for English locale (EN+AR)", async () => {
    const startTime = performance.now();
    const results = await searchHadithsCombined("test", "en", 50);
    const endTime = performance.now();

    expect(results.length).toBeGreaterThan(0);
    expect(endTime - startTime).toBeLessThan(500); // Should be under 500ms

    // Verify that EN and AR content is present, FR should be empty
    results.forEach((result) => {
      expect(result.matn_ar).toBeTruthy();
      expect(result.matn_en).toBeTruthy();
      expect(result.matn_fr).toBe(""); // Should be empty for EN locale
    });

    console.log(`English search took: ${endTime - startTime}ms`);
  });

  it("should use cache effectively for repeated queries", async () => {
    const query = "test";

    // First call - should hit database
    const startTime1 = performance.now();
    const results1 = await searchHadithsCombined(query, "fr", 10);
    const endTime1 = performance.now();

    // Second call - should hit cache
    const startTime2 = performance.now();
    const results2 = await searchHadithsCombined(query, "fr", 10);
    const endTime2 = performance.now();

    expect(results1.length).toBe(results2.length);
    expect(endTime2 - startTime2).toBeLessThan(endTime1 - startTime1); // Cache should be faster

    console.log(
      `First call: ${endTime1 - startTime1}ms, Cached call: ${endTime2 - startTime2}ms`
    );
  });
});
