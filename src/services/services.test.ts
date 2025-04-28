import { notFound } from "next/navigation";
import { Chapter, Narrator, Sahaba } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/prisma/prisma";
import { HadithType } from "../types/types";
import { slugify } from "../utils/slugify";
import * as services from "./services";

// Mock des modules Next.js et Prisma
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

vi.mock("@/prisma/prisma", () => ({
  prisma: {
    hadith: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    chapter: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    narrator: {
      findMany: vi.fn(),
    },
    sahaba: {
      findMany: vi.fn(),
    },
  },
}));

// Correction du mock de slugify : il doit utiliser la même logique que dans l'implémentation réelle
vi.mock("../utils/slugify", () => ({
  slugify: vi.fn((text: string) => text.toLowerCase().replace(/ /g, "-")),
}));

describe("Services", () => {
  // Date commune pour tous les tests
  const mockDate = new Date("2025-04-28T12:00:00Z");

  // Factory functions pour créer des objets mockés réutilisables
  const createMockChapter = (id: string, title: string): Chapter => ({
    id,
    title,
    createdAt: mockDate,
    updatedAt: mockDate,
  });

  const createMockNarrator = (
    id: string,
    name: string,
    nameArabic: string | null = null
  ): Narrator => ({
    id,
    name,
    nameArabic,
    createdAt: mockDate,
    updatedAt: mockDate,
  });

  const createMockSahaba = (
    id: string,
    name: string,
    nameArabic: string | null = null
  ): Sahaba => ({
    id,
    name,
    nameArabic,
    createdAt: mockDate,
    updatedAt: mockDate,
  });

  const createMockHadith = (
    id: string,
    numero: number,
    chapterId: string,
    narratorId: string,
    mentionedSahabas: Sahaba[] = []
  ): HadithType => ({
    id,
    numero,
    createdAt: mockDate,
    updatedAt: mockDate,
    matn_fr: `Texte français ${numero}`,
    matn_ar: `نص عربي ${numero}`,
    isnad: `Isnad ${numero}`,
    chapterId,
    narratorId,
    chapter: createMockChapter(
      chapterId,
      `Chapter ${chapterId.replace("chapter", "")}`
    ),
    narrator: createMockNarrator(
      narratorId,
      `Narrator ${narratorId.replace("narrator", "")}`
    ),
    mentionedSahabas,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // --- Hadith related tests ---
  describe("Hadith services", () => {
    it("should get all hadith numbers", async () => {
      const mockHadiths = [
        createMockHadith("1", 1, "chapter1", "narrator1"),
        createMockHadith("2", 2, "chapter1", "narrator1"),
        createMockHadith("3", 3, "chapter2", "narrator2"),
      ];
      vi.mocked(prisma.hadith.findMany).mockResolvedValue(mockHadiths);

      const result = await services.getHadithNumeros();

      expect(prisma.hadith.findMany).toHaveBeenCalledWith({
        select: { numero: true },
      });
      expect(result).toEqual([1, 2, 3]);
    });

    it("should get all hadiths", async () => {
      const mockHadiths = [
        createMockHadith("1", 1, "chapter1", "narrator1", [
          createMockSahaba("sahaba1", "Sahaba 1"),
        ]),
      ];
      vi.mocked(prisma.hadith.findMany).mockResolvedValue(mockHadiths);

      const result = await services.getAllHadiths();

      expect(prisma.hadith.findMany).toHaveBeenCalledWith({
        include: {
          chapter: true,
          narrator: true,
          mentionedSahabas: true,
        },
        orderBy: {
          numero: "asc",
        },
      });
      expect(await result).toEqual(mockHadiths);
    });

    it("should get hadith by numero", async () => {
      const mockHadith = createMockHadith("1", 1, "chapter1", "narrator1", [
        createMockSahaba("sahaba1", "Sahaba 1"),
      ]);
      vi.mocked(prisma.hadith.findUnique).mockResolvedValue(mockHadith);

      const result = await services.getHadithByNumero("1");

      expect(prisma.hadith.findUnique).toHaveBeenCalledWith({
        where: { numero: 1 },
        include: {
          chapter: true,
          narrator: true,
          mentionedSahabas: true,
        },
      });
      expect(result).toEqual(mockHadith);
    });

    it("should return undefined when hadith not found", async () => {
      vi.mocked(prisma.hadith.findUnique).mockResolvedValue(null);

      const result = await services.getHadithByNumero("999");

      expect(result).toBeUndefined();
    });
  });

  // --- Chapter related tests ---
  describe("Chapter services", () => {
    it("should get all chapters with hadith counts", async () => {
      const mockChapters = [
        {
          ...createMockChapter("1", "Chapter 1"),
          _count: { hadiths: 5 },
        },
        {
          ...createMockChapter("2", "Chapter 2"),
          _count: { hadiths: 10 },
        },
      ];
      vi.mocked(prisma.chapter.findMany).mockResolvedValue(mockChapters);

      const result = await services.getAllChapters();

      expect(prisma.chapter.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          title: true,
          _count: { select: { hadiths: true } },
        },
      });
      expect(result).toEqual([
        { id: "1", title: "Chapter 1", hadithCount: 5 },
        { id: "2", title: "Chapter 2", hadithCount: 10 },
      ]);
    });

    it("should get chapter by slug", async () => {
      const mockChapters = [
        createMockChapter("1", "Chapter One"),
        createMockChapter("2", "Chapter Two"),
      ];
      vi.mocked(prisma.chapter.findMany).mockResolvedValue(mockChapters);

      const result = await services.getChapterBySlug("chapter-one");

      expect(prisma.chapter.findMany).toHaveBeenCalled();
      expect(slugify).toHaveBeenCalledWith("Chapter One");
      expect(result).toEqual(createMockChapter("1", "Chapter One"));
    });

    it("should return null when chapter slug not found", async () => {
      vi.mocked(prisma.chapter.findMany).mockResolvedValue([]);

      const result = await services.getChapterBySlug("not-found");

      expect(result).toBeNull();
    });

    it("should get chapter by title", async () => {
      const mockChapter = createMockChapter("1", "Chapter One");
      vi.mocked(prisma.chapter.findUnique).mockResolvedValue(mockChapter);

      const result = await services.getChapterByTitle("Chapter One");

      expect(prisma.chapter.findUnique).toHaveBeenCalledWith({
        where: { title: "Chapter One" },
      });
      expect(result).toEqual(mockChapter);
    });

    it("should get hadiths by chapter slug", async () => {
      // Mock pour retourner le chapitre directement plutôt que d'appeler la fonction réelle
      const mockChapter = createMockChapter("1", "Chapter One");
      vi.mocked(prisma.chapter.findMany).mockResolvedValue([mockChapter]);

      // Assurez-vous que slugify fonctionne correctement pour ce test
      vi.mocked(slugify).mockReturnValue("chapter-one");

      // Mock pour les hadiths
      const mockHadiths = [createMockHadith("1", 1, "1", "narrator1")];
      vi.mocked(prisma.hadith.findMany).mockResolvedValue(mockHadiths);

      const result = await services.getHadithByChapterSlug("chapter-one");

      expect(prisma.chapter.findMany).toHaveBeenCalled();
      expect(slugify).toHaveBeenCalled();
      expect(prisma.hadith.findMany).toHaveBeenCalledWith({
        where: { chapter: { title: mockChapter.title } },
        include: {
          chapter: true,
          narrator: true,
          mentionedSahabas: true,
        },
        orderBy: {
          numero: "asc",
        },
      });
      expect(result).toEqual(mockHadiths);
    });

    it("should return empty array when chapter not found for hadiths", async () => {
      // Mock pour simuler qu'aucun chapitre n'est trouvé
      vi.mocked(prisma.chapter.findMany).mockResolvedValue([]);

      const result = await services.getHadithByChapterSlug("not-found");

      expect(result).toEqual([]);
      expect(prisma.hadith.findMany).not.toHaveBeenCalled();
    });
  });

  // --- Sahaba related tests ---
  describe("Sahaba services", () => {
    it("should get all sahabas with hadith counts", async () => {
      const mockSahabas = [
        {
          ...createMockSahaba("1", "Sahaba One"),
          _count: { mentionedInHadiths: 5 },
        },
        {
          ...createMockSahaba("2", "Sahaba Two", "صحابي اثنين"),
          _count: { mentionedInHadiths: 8 },
        },
      ];
      vi.mocked(prisma.sahaba.findMany).mockResolvedValue(mockSahabas);

      const result = await services.getAllSahabas();

      expect(prisma.sahaba.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          _count: { select: { mentionedInHadiths: true } },
        },
        orderBy: {
          name: "asc",
        },
      });
      expect(result).toEqual([
        { id: "1", name: "Sahaba One", hadithCount: 5 },
        { id: "2", name: "Sahaba Two", hadithCount: 8 },
      ]);
    });

    it("should get sahaba by slug", async () => {
      const mockSahabas = [
        createMockSahaba("1", "Sahaba One"),
        createMockSahaba("2", "Sahaba Two"),
      ];
      vi.mocked(prisma.sahaba.findMany).mockResolvedValue(mockSahabas);
      vi.mocked(slugify).mockReturnValue("sahaba-one");

      const result = await services.getSahabaBySlug("sahaba-one");

      expect(prisma.sahaba.findMany).toHaveBeenCalled();
      expect(slugify).toHaveBeenCalledWith("Sahaba One");
      expect(result).toEqual(createMockSahaba("1", "Sahaba One"));
    });

    it("should get sahaba with hadiths", async () => {
      const mockSahabas = [
        createMockSahaba("1", "Sahaba One"),
        createMockSahaba("2", "Sahaba Two"),
      ];
      const mockHadiths = [
        createMockHadith("1", 1, "chapter1", "narrator1", [
          createMockSahaba("1", "Sahaba One"),
        ]),
      ];

      vi.mocked(prisma.sahaba.findMany).mockResolvedValue(mockSahabas);
      vi.mocked(prisma.hadith.findMany).mockResolvedValue(mockHadiths);
      vi.mocked(slugify).mockReturnValue("sahaba-one");

      const result = await services.getSahabaWithHadiths("sahaba-one");

      expect(prisma.sahaba.findMany).toHaveBeenCalled();
      expect(slugify).toHaveBeenCalledWith("Sahaba One");
      expect(prisma.hadith.findMany).toHaveBeenCalledWith({
        where: { mentionedSahabas: { some: { name: "Sahaba One" } } },
        include: {
          chapter: true,
          narrator: true,
          mentionedSahabas: true,
        },
        orderBy: {
          numero: "asc",
        },
      });
      expect(result).toEqual({
        sahaba: createMockSahaba("1", "Sahaba One"),
        hadiths: mockHadiths,
      });
    });
  });

  // --- Narrator related tests ---
  describe("Narrator services", () => {
    it("should get all narrators with hadith counts", async () => {
      const mockNarrators = [
        {
          ...createMockNarrator("1", "Narrator One"),
          _count: { narratedHadiths: 3 },
        },
        {
          ...createMockNarrator("2", "Narrator Two", "الراوي الثاني"),
          _count: { narratedHadiths: 7 },
        },
      ];
      vi.mocked(prisma.narrator.findMany).mockResolvedValue(mockNarrators);

      const result = await services.getAllNarrators();

      expect(prisma.narrator.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          _count: { select: { narratedHadiths: true } },
        },
        orderBy: {
          name: "asc",
        },
      });
      expect(result).toEqual([
        { id: "1", name: "Narrator One", hadithCount: 3 },
        { id: "2", name: "Narrator Two", hadithCount: 7 },
      ]);
    });

    it("should get narrator by slug", async () => {
      const mockNarrators = [
        createMockNarrator("1", "Narrator One"),
        createMockNarrator("2", "Narrator Two"),
      ];
      vi.mocked(prisma.narrator.findMany).mockResolvedValue(mockNarrators);
      vi.mocked(slugify).mockReturnValue("narrator-one");

      const result = await services.getNarratorBySlug("narrator-one");

      expect(prisma.narrator.findMany).toHaveBeenCalled();
      expect(slugify).toHaveBeenCalledWith("Narrator One");
      expect(result).toEqual(createMockNarrator("1", "Narrator One"));
    });

    it("should call notFound when narrator not found in getNarratorWithHadiths", async () => {
      vi.mocked(prisma.narrator.findMany).mockResolvedValue([]);

      await services.getNarratorWithHadiths("not-found");

      expect(notFound).toHaveBeenCalled();
    });

    it("should get narrator with hadiths", async () => {
      const mockNarrators = [
        createMockNarrator("1", "Narrator One"),
        createMockNarrator("2", "Narrator Two"),
      ];
      const mockHadiths = [createMockHadith("1", 1, "chapter1", "narrator1")];

      vi.mocked(prisma.narrator.findMany).mockResolvedValue(mockNarrators);
      vi.mocked(prisma.hadith.findMany).mockResolvedValue(mockHadiths);
      vi.mocked(slugify).mockReturnValue("narrator-one");
      vi.mocked(notFound).mockReturnValue({} as never);

      const result = await services.getNarratorWithHadiths("narrator-one");

      expect(prisma.narrator.findMany).toHaveBeenCalled();
      expect(slugify).toHaveBeenCalledWith("Narrator One");
      expect(prisma.hadith.findMany).toHaveBeenCalledWith({
        where: { narrator: { name: "Narrator One" } },
        include: {
          chapter: true,
          narrator: true,
          mentionedSahabas: true,
        },
        orderBy: {
          numero: "asc",
        },
      });
      expect(result).toEqual({
        narrator: createMockNarrator("1", "Narrator One"),
        hadiths: mockHadiths,
      });
    });
  });

  // --- Search page functions tests ---
  describe("Search page functions", () => {
    it("should get narrator names", async () => {
      const mockNarrators = [
        createMockNarrator("1", "Narrator One"),
        createMockNarrator("2", "Narrator Two"),
      ];
      vi.mocked(prisma.narrator.findMany).mockResolvedValue(mockNarrators);

      const result = await services.getNarratorNames();

      expect(prisma.narrator.findMany).toHaveBeenCalledWith({
        select: {
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });
      expect(result).toEqual(["Narrator One", "Narrator Two"]);
    });

    it("should get sahaba names", async () => {
      const mockSahabas = [
        createMockSahaba("1", "Sahaba One"),
        createMockSahaba("2", "Sahaba Two"),
      ];
      vi.mocked(prisma.sahaba.findMany).mockResolvedValue(mockSahabas);

      const result = await services.getSahabaNames();

      expect(prisma.sahaba.findMany).toHaveBeenCalledWith({
        select: {
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });
      expect(result).toEqual(["Sahaba One", "Sahaba Two"]);
    });
  });
});
