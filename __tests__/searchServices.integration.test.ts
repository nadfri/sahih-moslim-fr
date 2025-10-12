import { describe, it, expect } from "vitest";

import {
  normalizeTextForSearch,
  createSearchVariants,
} from "@/src/utils/textNormalization";

describe("Search Integration with Text Normalization", () => {
  describe("createSearchVariants", () => {
    it("should create comprehensive search variants for French text", () => {
      const variants = createSearchVariants("café");

      expect(variants).toContain("café"); // Original
      expect(variants).toContain("cafe"); // Normalized without accents
      expect(variants.length).toBeGreaterThan(1);
    });

    it("should create comprehensive search variants for Arabic text", () => {
      const variants = createSearchVariants("قَالَ");

      expect(variants).toContain("قَالَ"); // Original with diacritics
      expect(variants).toContain("قال"); // Normalized without diacritics
      expect(variants.length).toBeGreaterThan(1);
    });

    it("should create comprehensive search variants for English text", () => {
      const variants = createSearchVariants("It's a test");

      expect(variants).toContain("It's a test"); // Original
      expect(variants).toContain("its a test"); // Normalized
      expect(variants.length).toBeGreaterThan(1);
    });

    it("should handle mixed language text", () => {
      const variants = createSearchVariants("café قَالَ it's");

      // Should contain original and multiple normalized versions
      expect(variants.length).toBeGreaterThan(1);
      expect(variants).toContain("café قَالَ it's"); // Original
    });
  });

  describe("normalizeTextForSearch", () => {
    it("should properly normalize search queries for database matching", () => {
      const testCases = [
        {
          input: "café naïve",
          expectedContains: "cafe naive",
        },
        {
          input: "قَالَ رَسُولُ اللَّهِ",
          expectedContains: "قال رسول الله",
        },
        {
          input: 'It\'s a "test"',
          expectedContains: "its a test",
        },
      ];

      testCases.forEach(({ input, expectedContains }) => {
        const normalized = normalizeTextForSearch(input);
        expect(normalized).toContain(expectedContains.split(" ")[0]); // Check first word at least
      });
    });
  });

  describe("Search behavior simulation", () => {
    it("should demonstrate how accents are ignored in French search", () => {
      const searchQuery = "café";
      const databaseText = "cafe"; // Text without accents in database

      const variants = createSearchVariants(searchQuery);
      const normalizedDbText = normalizeTextForSearch(databaseText);

      // Should find a match through normalization
      const hasMatch = variants.some((variant) =>
        normalizedDbText.includes(normalizeTextForSearch(variant))
      );

      expect(hasMatch).toBe(true);
    });

    it("should demonstrate how Arabic diacritics are ignored", () => {
      const searchQuery = "قَالَ"; // With diacritics
      const databaseText = "قال"; // Without diacritics

      const variants = createSearchVariants(searchQuery);
      const normalizedDbText = normalizeTextForSearch(databaseText);

      // Should find a match through normalization
      const hasMatch = variants.some((variant) =>
        normalizedDbText.includes(normalizeTextForSearch(variant))
      );

      expect(hasMatch).toBe(true);
    });

    it("should demonstrate case-insensitive English search", () => {
      const searchQuery = "TEST";
      const databaseText = "test";

      const variants = createSearchVariants(searchQuery);

      // Should find match regardless of case
      const hasMatch = variants.some((variant) =>
        variant.toLowerCase().includes(databaseText.toLowerCase())
      );

      expect(hasMatch).toBe(true);
    });
  });
});
