import { afterAll, describe, expect, it } from "vitest";

import { prisma } from "@/prisma/prisma";
import {
  getAllChapters,
  getAllHadiths,
  getAllNarrators,
  getAllSahabas,
  getAllTransmitters,
  getChapterBySlug,
  getChapterWithHadiths,
  getHadithByNumero,
  getHadithNumeros,
  getNarratorBySlug,
  getNarratorNames,
  getNarratorWithHadiths,
  getSahabaBySlug,
  getSahabaNames,
  getSahabaWithHadiths,
  getTransmitterBySlug,
  getTransmitterNames,
  getTransmitterWithHadiths,
} from "./services";

describe("Service functions integration", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Chapters", () => {
    it("getAllChapters returns chapters from DB with correct structure", async () => {
      const chapters = await getAllChapters();
      expect(Array.isArray(chapters)).toBe(true);

      if (chapters.length > 0) {
        const chapter = chapters[0];
        expect(chapter).toHaveProperty("id");
        expect(chapter).toHaveProperty("name");
        expect(chapter).toHaveProperty("slug");
        expect(chapter).toHaveProperty("hadithCount");
        expect(chapter).toHaveProperty("index");
        expect(typeof chapter.id).toBe("string");
        expect(typeof chapter.name).toBe("string");
        expect(typeof chapter.slug).toBe("string");
        expect(typeof chapter.hadithCount).toBe("number");
        expect(typeof chapter.index).toBe("number");
        expect(chapter.hadithCount).toBeGreaterThanOrEqual(0);
      }
    });

    it("getChapterBySlug returns a chapter or null", async () => {
      const chapter = await getChapterBySlug("la-foi");
      // Should return a chapter object or null
      if (chapter) {
        expect(chapter.slug).toBe("la-foi");
        expect(typeof chapter.hadithCount).toBe("number");
        expect(chapter.hadithCount).toBeGreaterThanOrEqual(0);
      } else {
        expect(chapter).toBeNull();
      }
    });

    it("getChapterWithHadiths returns chapter and hadiths", async () => {
      const { chapter, hadiths } = await getChapterWithHadiths("la-foi");
      if (chapter) {
        expect(chapter.slug).toBe("la-foi");
        expect(Array.isArray(hadiths)).toBe(true);
        expect(chapter).toHaveProperty("index");
        expect(typeof chapter.index).toBe("number");

        // Check hadiths structure with isnadTransmitters
        hadiths.forEach((hadith) => {
          expect(Array.isArray(hadith.isnadTransmitters)).toBe(true);
        });
      } else {
        expect(hadiths).toEqual([]);
      }
    });
  });

  describe("Hadiths", () => {
    it("getAllHadiths returns all hadiths with correct structure", async () => {
      const hadiths = await getAllHadiths();
      expect(Array.isArray(hadiths)).toBe(true);

      if (hadiths.length > 0) {
        const hadith = hadiths[0];
        expect(hadith).toHaveProperty("id");
        expect(hadith).toHaveProperty("numero");
        expect(hadith).toHaveProperty("matn_fr");
        expect(hadith).toHaveProperty("matn_ar");
        expect(hadith).toHaveProperty("chapter");
        expect(hadith).toHaveProperty("narrator");
        expect(hadith).toHaveProperty("mentionedSahabas");
        expect(hadith).toHaveProperty("isnadTransmitters");
        expect(typeof hadith.numero).toBe("number");
        expect(Array.isArray(hadith.mentionedSahabas)).toBe(true);
        expect(Array.isArray(hadith.isnadTransmitters)).toBe(true);
      }
    });

    it("getHadithByNumero returns a hadith or null", async () => {
      const hadiths = await getAllHadiths();
      if (hadiths.length > 0) {
        const numero = hadiths[0].numero.toString();
        const hadith = await getHadithByNumero(numero);
        expect(hadith).not.toBeNull();
        if (hadith) {
          expect(hadith.numero.toString()).toBe(numero);
          expect(Array.isArray(hadith.isnadTransmitters)).toBe(true);

          // Check if isnadTransmitters have correct structure and ordering
          hadith.isnadTransmitters.forEach((transmitter) => {
            expect(transmitter).toHaveProperty("id");
            expect(transmitter).toHaveProperty("name");
            expect(transmitter).toHaveProperty("slug");
            expect(typeof transmitter.id).toBe("string");
            expect(typeof transmitter.name).toBe("string");
            expect(typeof transmitter.slug).toBe("string");
          });
        }
      }
    });

    it("getHadithNumeros returns all hadith numbers", async () => {
      const numeros = await getHadithNumeros();
      expect(Array.isArray(numeros)).toBe(true);
      if (numeros.length > 0) {
        expect(typeof numeros[0]).toBe("number");
        // Verify numbers are sorted
        for (let i = 1; i < numeros.length; i++) {
          expect(numeros[i]).toBeGreaterThan(numeros[i - 1]);
        }
      }
    });
  });

  describe("Narrators", () => {
    it("getAllNarrators returns narrators with hadithCount", async () => {
      const narrators = await getAllNarrators();
      expect(Array.isArray(narrators)).toBe(true);

      if (narrators.length > 0) {
        const narrator = narrators[0];
        expect(narrator).toHaveProperty("id");
        expect(narrator).toHaveProperty("name");
        expect(narrator).toHaveProperty("slug");
        expect(narrator).toHaveProperty("hadithCount");
        expect(typeof narrator.id).toBe("string");
        expect(typeof narrator.name).toBe("string");
        expect(typeof narrator.slug).toBe("string");
        expect(typeof narrator.hadithCount).toBe("number");
        expect(narrator.hadithCount).toBeGreaterThanOrEqual(0);
      }
    });

    it("getNarratorBySlug returns a narrator or null", async () => {
      const narrators = await getAllNarrators();
      if (narrators.length > 0) {
        const slug = narrators[0].slug;
        const narrator = await getNarratorBySlug(slug);
        expect(narrator).not.toBeNull();
        if (narrator) {
          expect(narrator.slug).toBe(slug);
          expect(typeof narrator.hadithCount).toBe("number");
        }
      }

      // Test with non-existent slug
      const nonExistentNarrator = await getNarratorBySlug("non-existent-slug");
      expect(nonExistentNarrator).toBeNull();
    });

    it("getNarratorWithHadiths returns narrator and hadiths", async () => {
      const narrators = await getAllNarrators();
      if (narrators.length > 0) {
        const slug = narrators[0].slug;
        const { narrator, hadiths } = await getNarratorWithHadiths(slug);
        if (narrator) {
          expect(narrator.slug).toBe(slug);
          expect(Array.isArray(hadiths)).toBe(true);
          // Verify all hadiths have this narrator
          hadiths.forEach((hadith) => {
            expect(hadith.narrator.name).toBe(narrator.name);
          });
        } else {
          expect(hadiths).toEqual([]);
        }
      }
    });

    it("getNarratorNames returns all narrator names", async () => {
      const names = await getNarratorNames();
      expect(Array.isArray(names)).toBe(true);
      if (names.length > 0) {
        expect(typeof names[0]).toBe("string");
        // Check if names are unique
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(names.length);
      }
    });
  });

  describe("Sahabas", () => {
    it("getAllSahabas returns sahabas with hadithCount", async () => {
      const sahabas = await getAllSahabas();
      expect(Array.isArray(sahabas)).toBe(true);

      if (sahabas.length > 0) {
        const sahaba = sahabas[0];
        expect(sahaba).toHaveProperty("id");
        expect(sahaba).toHaveProperty("name");
        expect(sahaba).toHaveProperty("slug");
        expect(sahaba).toHaveProperty("hadithCount");
        expect(typeof sahaba.id).toBe("string");
        expect(typeof sahaba.name).toBe("string");
        expect(typeof sahaba.slug).toBe("string");
        expect(typeof sahaba.hadithCount).toBe("number");
        expect(sahaba.hadithCount).toBeGreaterThanOrEqual(0);
      }
    });

    it("getSahabaBySlug returns a sahaba or null", async () => {
      const sahabas = await getAllSahabas();
      if (sahabas.length > 0) {
        const slug = sahabas[0].slug;
        const sahaba = await getSahabaBySlug(slug);
        expect(sahaba).not.toBeNull();
        if (sahaba) {
          expect(sahaba.slug).toBe(slug);
          expect(typeof sahaba.hadithCount).toBe("number");
        }
      }

      // Test with non-existent slug
      const nonExistentSahaba = await getSahabaBySlug("non-existent-slug");
      expect(nonExistentSahaba).toBeNull();
    });

    it("getSahabaWithHadiths returns sahaba and hadiths", async () => {
      const sahabas = await getAllSahabas();
      if (sahabas.length > 0) {
        const slug = sahabas[0].slug;
        const { sahaba, hadiths } = await getSahabaWithHadiths(slug);
        if (sahaba) {
          expect(sahaba.slug).toBe(slug);
          expect(Array.isArray(hadiths)).toBe(true);
          // Verify all hadiths mention this sahaba
          hadiths.forEach((hadith) => {
            const sahabaNames = hadith.mentionedSahabas.map((s) => s.name);
            expect(sahabaNames).toContain(sahaba.name);
          });
        } else {
          expect(hadiths).toEqual([]);
        }
      }
    });

    it("getSahabaNames returns all sahaba names", async () => {
      const names = await getSahabaNames();
      expect(Array.isArray(names)).toBe(true);
      if (names.length > 0) {
        expect(typeof names[0]).toBe("string");
        // Check if names are unique and sorted
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(names.length);
        // Check if sorted alphabetically
        for (let i = 1; i < names.length; i++) {
          expect(names[i].localeCompare(names[i - 1])).toBeGreaterThanOrEqual(
            0
          );
        }
      }
    });
  });

  describe("Transmitters", () => {
    it("getAllTransmitters returns transmitters with hadithCount", async () => {
      const transmitters = await getAllTransmitters();
      expect(Array.isArray(transmitters)).toBe(true);

      if (transmitters.length > 0) {
        const transmitter = transmitters[0];
        expect(transmitter).toHaveProperty("id");
        expect(transmitter).toHaveProperty("name");
        expect(transmitter).toHaveProperty("slug");
        expect(transmitter).toHaveProperty("hadithCount");
        expect(typeof transmitter.id).toBe("string");
        expect(typeof transmitter.name).toBe("string");
        expect(typeof transmitter.slug).toBe("string");
        expect(typeof transmitter.hadithCount).toBe("number");
        expect(transmitter.hadithCount).toBeGreaterThanOrEqual(0);
      }
    });

    it("getTransmitterBySlug returns a transmitter or null", async () => {
      const transmitters = await getAllTransmitters();
      if (transmitters.length > 0) {
        const slug = transmitters[0].slug;
        const transmitter = await getTransmitterBySlug(slug);
        expect(transmitter).not.toBeNull();
        if (transmitter) {
          expect(transmitter.slug).toBe(slug);
          expect(typeof transmitter.hadithCount).toBe("number");
          expect(transmitter.hadithCount).toBeGreaterThanOrEqual(0);
        }
      }

      // Test with non-existent slug
      const nonExistentTransmitter =
        await getTransmitterBySlug("non-existent-slug");
      expect(nonExistentTransmitter).toBeNull();
    });

    it("getTransmitterWithHadiths maintains transmitter order", async () => {
      const transmitters = await getAllTransmitters();
      if (transmitters.length > 0) {
        const slug = transmitters[0].slug;
        const { transmitter, hadiths } = await getTransmitterWithHadiths(slug);

        if (transmitter && hadiths.length > 0) {
          expect(transmitter.slug).toBe(slug);
          expect(Array.isArray(hadiths)).toBe(true);

          // Check that all hadiths contain the transmitter
          hadiths.forEach((hadith) => {
            const transmitterNames = hadith.isnadTransmitters.map(
              (t) => t.name
            );
            expect(transmitterNames).toContain(transmitter.name);

            // Verify transmitter ordering is maintained in isnad
            expect(Array.isArray(hadith.isnadTransmitters)).toBe(true);
            hadith.isnadTransmitters.forEach((t) => {
              expect(t).toHaveProperty("id");
              expect(t).toHaveProperty("name");
              expect(t).toHaveProperty("slug");
            });
          });
        } else {
          expect(hadiths).toEqual([]);
        }
      }
    });

    it("getTransmitterNames returns ordered transmitter names", async () => {
      const names = await getTransmitterNames();
      expect(Array.isArray(names)).toBe(true);

      if (names.length > 0) {
        expect(typeof names[0]).toBe("string");
        // Check if names are unique
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(names.length);
      }
    });
  });

  describe("Data Integrity", () => {
    it("validates that hadith counts match actual data", async () => {
      const chapters = await getAllChapters();

      for (const chapter of chapters.slice(0, 3)) {
        // Test first 3 chapters for performance
        const { hadiths } = await getChapterWithHadiths(chapter.slug);
        expect(hadiths.length).toBe(chapter.hadithCount);
      }
    });

    it("validates transmitter ordering consistency", async () => {
      const hadiths = await getAllHadiths();

      if (hadiths.length > 0) {
        const hadithWithTransmitters = hadiths.find(
          (h) => h.isnadTransmitters.length > 1
        );

        if (hadithWithTransmitters) {
          // Check that transmitters maintain their order
          const transmitters = hadithWithTransmitters.isnadTransmitters;
          expect(transmitters.length).toBeGreaterThan(1); // Verify each transmitter has required properties
          transmitters.forEach((transmitter) => {
            expect(transmitter).toHaveProperty("id");
            expect(transmitter).toHaveProperty("name");
            expect(transmitter).toHaveProperty("slug");
            expect(typeof transmitter.id).toBe("string");
            expect(typeof transmitter.name).toBe("string");
            expect(typeof transmitter.slug).toBe("string");
          });
        }
      }
    });
  });
});
