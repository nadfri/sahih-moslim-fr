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

  it("getAllChapters returns chapters from DB", async () => {
    const chapters = await getAllChapters();
    expect(Array.isArray(chapters)).toBe(true);
    expect(chapters.some((c) => c.slug === "la-foi")).toBe(true);
  });

  it("getChapterBySlug returns a chapter or null", async () => {
    const chapter = await getChapterBySlug("la-foi");
    // Should return a chapter object or null
    if (chapter) {
      expect(chapter.slug).toBe("la-foi");
      expect(typeof chapter.hadithCount).toBe("number");
    } else {
      expect(chapter).toBeNull();
    }
  });

  it("getChapterWithHadiths returns chapter and hadiths", async () => {
    const { chapter, hadiths } = await getChapterWithHadiths("la-foi");
    if (chapter) {
      expect(chapter.slug).toBe("la-foi");
      expect(Array.isArray(hadiths)).toBe(true);
    } else {
      expect(hadiths).toEqual([]);
    }
  });

  it("getAllHadiths returns all hadiths", async () => {
    const hadiths = await getAllHadiths();
    expect(Array.isArray(hadiths)).toBe(true);
    if (hadiths.length > 0) {
      expect(typeof hadiths[0].numero).toBe("number");
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
      }
    }
  });

  it("getHadithNumeros returns all hadith numbers", async () => {
    const numeros = await getHadithNumeros();
    expect(Array.isArray(numeros)).toBe(true);
    if (numeros.length > 0) {
      expect(typeof numeros[0]).toBe("number");
    }
  });

  it("getAllNarrators returns all narrators", async () => {
    const narrators = await getAllNarrators();
    expect(Array.isArray(narrators)).toBe(true);
    if (narrators.length > 0) {
      expect(typeof narrators[0].name).toBe("string");
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
      }
    }
  });

  it("getNarratorWithHadiths returns narrator and hadiths", async () => {
    const narrators = await getAllNarrators();
    if (narrators.length > 0) {
      const slug = narrators[0].slug;
      const { narrator, hadiths } = await getNarratorWithHadiths(slug);
      if (narrator) {
        expect(narrator.slug).toBe(slug);
        expect(Array.isArray(hadiths)).toBe(true);
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
    }
  });

  it("getAllSahabas returns all sahabas", async () => {
    const sahabas = await getAllSahabas();
    expect(Array.isArray(sahabas)).toBe(true);
    if (sahabas.length > 0) {
      expect(typeof sahabas[0].name).toBe("string");
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
      }
    }
  });

  it("getSahabaWithHadiths returns sahaba and hadiths", async () => {
    const sahabas = await getAllSahabas();
    if (sahabas.length > 0) {
      const slug = sahabas[0].slug;
      const { sahaba, hadiths } = await getSahabaWithHadiths(slug);
      if (sahaba) {
        expect(sahaba.slug).toBe(slug);
        expect(Array.isArray(hadiths)).toBe(true);
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
    }
  });

  it("getAllTransmitters returns all transmitters", async () => {
    const transmitters = await getAllTransmitters();
    expect(Array.isArray(transmitters)).toBe(true);
    if (transmitters.length > 0) {
      expect(typeof transmitters[0].name).toBe("string");
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
      }
    }
  });

  it("getTransmitterWithHadiths returns transmitter and hadiths", async () => {
    const transmitters = await getAllTransmitters();
    if (transmitters.length > 0) {
      const slug = transmitters[0].slug;
      const { transmitter, hadiths } = await getTransmitterWithHadiths(slug);
      if (transmitter) {
        expect(transmitter.slug).toBe(slug);
        expect(Array.isArray(hadiths)).toBe(true);
      } else {
        expect(hadiths).toEqual([]);
      }
    }
  });

  it("getTransmitterNames returns all transmitter names", async () => {
    const names = await getTransmitterNames();
    expect(Array.isArray(names)).toBe(true);
    if (names.length > 0) {
      expect(typeof names[0]).toBe("string");
    }
  });
});
