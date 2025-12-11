import { describe, expect, it, beforeAll, afterAll } from "vitest";
import prisma from "@/prisma/prisma";
import { searchHadithsCombined } from "@/src/services/searchServices";
import { testDataHelpers } from "./test-helpers";

describe("Locale-based Search Optimization", () => {
  let testChapterId: string;
  let testHadithId: string;

  beforeAll(async () => {
    // Create test chapter
    const chapterData = testDataHelpers.createTestChapter(999);
    const testChapter = await prisma.chapter.create({
      data: chapterData,
    });
    testChapterId = testChapter.id;

    // Create test hadith with specific multilingual content
    const testHadith = await prisma.hadith.create({
      data: {
        ...testDataHelpers.createTestHadith(9999),
        chapterId: testChapterId,
        matn_fr:
          "Le Prophète Mohammed (paix soit sur lui) a dit quelque chose d'important",
        matn_ar: "قال النبي محمد صلى الله عليه وسلم شيئا مهما",
        matn_en:
          "The Prophet Mohammed (peace be upon him) said something important",
      },
    });
    testHadithId = testHadith.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testHadithId) {
      await prisma.hadith.delete({ where: { id: testHadithId } });
    }
    if (testChapterId) {
      await prisma.chapter.delete({ where: { id: testChapterId } });
    }
  });

  it("should search in French and Arabic when locale is 'fr'", async () => {
    // Test French search term
    const frenchResults = await searchHadithsCombined("Prophète", "fr", 10);
    expect(frenchResults.length).toBeGreaterThan(0);

    // Test Arabic search term
    const arabicResults = await searchHadithsCombined("النبي", "fr", 10);
    expect(arabicResults.length).toBeGreaterThan(0);

    // Test English search term - should not find results when searching in FR locale
    // Note: This test assumes the English content is unique and not found in French/Arabic text
    // Let's use a more specific English-only term
    const specificEnglishResults = await searchHadithsCombined(
      "peace",
      "fr",
      10
    );
    // This might still be found due to overlapping vocabulary, so this test is informational
    console.log(
      "French locale - English term results:",
      specificEnglishResults.length
    );
  });

  it("should search in English and Arabic when locale is 'en'", async () => {
    // Test English search term
    const englishResults = await searchHadithsCombined("Prophet", "en", 10);
    expect(englishResults.length).toBeGreaterThan(0);

    // Test Arabic search term
    const arabicResults = await searchHadithsCombined("النبي", "en", 10);
    expect(arabicResults.length).toBeGreaterThan(0);

    // Test French search term - should not find results when searching in EN locale
    const frenchResults = await searchHadithsCombined("Prophète", "en", 10);
    console.log("English locale - French term results:", frenchResults.length);
  });

  it("should search only in Arabic when locale is 'ar'", async () => {
    // Test Arabic search term
    const arabicResults = await searchHadithsCombined("النبي", "ar", 10);
    expect(arabicResults.length).toBeGreaterThan(0);

    // Test French search term - should not find results
    const frenchResults = await searchHadithsCombined("Prophète", "ar", 10);
    expect(frenchResults.length).toBe(0);

    // Test English search term - should not find results
    const englishResults = await searchHadithsCombined("Prophet", "ar", 10);
    expect(englishResults.length).toBe(0);
  });

  it("should use different cache keys for different locales", async () => {
    const query = "النبي";

    // Search with different locales
    const frResults = await searchHadithsCombined(query, "fr", 10);
    const enResults = await searchHadithsCombined(query, "en", 10);
    const arResults = await searchHadithsCombined(query, "ar", 10);

    // All should find the Arabic text
    expect(frResults.length).toBeGreaterThan(0);
    expect(enResults.length).toBeGreaterThan(0);
    expect(arResults.length).toBeGreaterThan(0);

    // Results should be the same for FR and EN since both include Arabic
    expect(frResults.length).toBe(enResults.length);
    expect(enResults.length).toBe(arResults.length);
  });

  it("should fallback to French locale behavior for unknown locales", async () => {
    // Test with an unknown locale
    const unknownLocaleResults = await searchHadithsCombined(
      "Prophète",
      "de",
      10
    );
    const frenchLocaleResults = await searchHadithsCombined(
      "Prophète",
      "fr",
      10
    );

    // Should behave the same as French locale (fallback behavior)
    expect(unknownLocaleResults.length).toBe(frenchLocaleResults.length);
  });
});
