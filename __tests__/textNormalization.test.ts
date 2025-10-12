import { describe, it, expect } from "vitest";

import {
  normalizeArabicText,
  normalizeFrenchText,
  normalizeEnglishText,
  normalizeTextForSearch,
  containsArabic,
  containsFrenchAccents,
  createSearchVariants,
} from "@/src/utils/textNormalization";

describe("textNormalization", () => {
  describe("normalizeFrenchText", () => {
    it("should remove French accents", () => {
      expect(normalizeFrenchText("café")).toBe("cafe");
      expect(normalizeFrenchText("naïve")).toBe("naive");
      expect(normalizeFrenchText("être")).toBe("etre");
      expect(normalizeFrenchText("Noël")).toBe("noel");
      expect(normalizeFrenchText("cœur")).toBe("coeur");
      expect(normalizeFrenchText("Élève")).toBe("eleve");
    });

    it("should handle special French characters", () => {
      expect(normalizeFrenchText("œuvre")).toBe("oeuvre");
      expect(normalizeFrenchText("Œuf")).toBe("oeuf");
      expect(normalizeFrenchText("ça")).toBe("ca");
      expect(normalizeFrenchText("Ça")).toBe("ca");
    });

    it("should return empty string for empty input", () => {
      expect(normalizeFrenchText("")).toBe("");
      expect(normalizeFrenchText("   ")).toBe("");
    });
  });

  describe("normalizeArabicText", () => {
    it("should remove Arabic diacritics", () => {
      expect(normalizeArabicText("قَالَ")).toBe("قال");
      expect(normalizeArabicText("رَسُولُ")).toBe("رسول");
      expect(normalizeArabicText("اللَّهِ")).toBe("الله");
      expect(normalizeArabicText("صَلَّى")).toBe("صلى");
    });

    it("should remove tatweel and normalize whitespace", () => {
      expect(normalizeArabicText("الـلـه")).toBe("الله");
      expect(normalizeArabicText("  قال  ")).toBe("قال");
    });

    it("should return empty string for empty input", () => {
      expect(normalizeArabicText("")).toBe("");
      expect(normalizeArabicText("   ")).toBe("");
    });
  });

  describe("normalizeEnglishText", () => {
    it("should remove special characters and normalize", () => {
      expect(normalizeEnglishText("It's a test")).toBe("its a test");
      expect(normalizeEnglishText('A "quoted" text')).toBe("a quoted text");
      expect(normalizeEnglishText("Text with 'apostrophes'")).toBe(
        "text with apostrophes"
      );
      expect(normalizeEnglishText("Special!@#$%^&*()")).toBe("special");
    });

    it("should normalize whitespace", () => {
      expect(normalizeEnglishText("  multiple   spaces  ")).toBe(
        "multiple spaces"
      );
    });

    it("should return empty string for empty input", () => {
      expect(normalizeEnglishText("")).toBe("");
      expect(normalizeEnglishText("   ")).toBe("");
    });
  });

  describe("normalizeTextForSearch", () => {
    it("should handle French text with accents", () => {
      const result = normalizeTextForSearch("café naïve");
      expect(result).toBe("cafe naive");
    });

    it("should handle Arabic text with diacritics", () => {
      const result = normalizeTextForSearch("قَالَ رَسُولُ اللَّهِ");
      expect(result).toBe("قال رسول الله");
    });

    it("should handle English text with special characters", () => {
      const result = normalizeTextForSearch('It\'s a "test"');
      expect(result).toBe("its a test");
    });

    it("should handle mixed language text", () => {
      const result = normalizeTextForSearch("café قَالَ it's");
      expect(result).toBe("cafe قال its");
    });
  });

  describe("containsArabic", () => {
    it("should detect Arabic characters", () => {
      expect(containsArabic("قال")).toBe(true);
      expect(containsArabic("Hello قال World")).toBe(true);
      expect(containsArabic("Hello World")).toBe(false);
      expect(containsArabic("")).toBe(false);
    });
  });

  describe("containsFrenchAccents", () => {
    it("should detect French accented characters", () => {
      expect(containsFrenchAccents("café")).toBe(true);
      expect(containsFrenchAccents("naïve")).toBe(true);
      expect(containsFrenchAccents("être")).toBe(true);
      expect(containsFrenchAccents("hello")).toBe(false);
      expect(containsFrenchAccents("")).toBe(false);
    });
  });

  describe("createSearchVariants", () => {
    it("should create variants for French text", () => {
      const variants = createSearchVariants("café");
      expect(variants).toContain("café");
      expect(variants).toContain("cafe");
      expect(variants).toContain("café"); // lowercase original
    });

    it("should create variants for Arabic text", () => {
      const variants = createSearchVariants("قَالَ");
      expect(variants).toContain("قَالَ");
      expect(variants).toContain("قال");
    });

    it("should create variants for English text", () => {
      const variants = createSearchVariants("It's a Test");
      expect(variants).toContain("It's a Test");
      expect(variants).toContain("its a test");
      expect(variants).toContain("it's a test"); // lowercase original
    });

    it("should remove duplicates", () => {
      const variants = createSearchVariants("test");
      const uniqueVariants = [...new Set(variants)];
      expect(variants.length).toBe(uniqueVariants.length);
    });

    it("should handle empty string", () => {
      const variants = createSearchVariants("");
      expect(variants).toEqual([]);
    });
  });
});
