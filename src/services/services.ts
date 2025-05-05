import { z } from "zod";

import { prisma } from "@/prisma/prisma";
import {
  ChapterType,
  HadithSchema,
  HadithType,
  PersonType,
} from "../types/types";

// Get all hadith numbers
export async function getHadithNumeros(): Promise<number[]> {
  const hadiths = await prisma.hadith.findMany({
    select: { numero: true },
  });

  return hadiths.map((hadith) => hadith.numero);
}

// Get all hadiths, parsed with zod
export async function getAllHadiths(): Promise<HadithType[]> {
  const hadiths = await prisma.hadith.findMany({
    include: {
      chapter: true,
      narrator: true,
      mentionedSahabas: true,
    },
    orderBy: { numero: "asc" },
  });
  // Parse to remove unwanted fields and ensure types
  return z.array(HadithSchema).parse(hadiths);
}

// Get a single hadith by numero, parsed with zod
export async function getHadithByNumero(
  numero: string
): Promise<HadithType | null> {
  const hadith = await prisma.hadith.findUnique({
    where: { numero: parseInt(numero) },
    include: {
      chapter: true,
      narrator: true,
      mentionedSahabas: true,
    },
  });

  return hadith ? HadithSchema.parse(hadith) : null;
}

// Get all chapters with hadith count
export async function getAllChapters(): Promise<ChapterType[]> {
  const chapters = await prisma.chapter.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      _count: { select: { hadiths: true } },
    },
  });
  // Map to ChapterType with hadithCount
  return chapters.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    hadithCount: c._count.hadiths,
  }));
}

// Get a single chapter by slug with hadith count
export async function getChapterBySlug(
  slug: string
): Promise<ChapterType | null> {
  const chapter = await prisma.chapter.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      _count: { select: { hadiths: true } },
    },
  });
  // Return mapped chapter or null
  return chapter
    ? {
        id: chapter.id,
        title: chapter.title,
        slug: chapter.slug,
        hadithCount: chapter._count.hadiths,
      }
    : null;
}

// Get a chapter and its hadiths
export async function getChapterWithHadiths(slug: string): Promise<{
  chapter: ChapterType | null;
  hadiths: HadithType[];
}> {
  const chapter = await getChapterBySlug(slug);

  if (!chapter) return { chapter: null, hadiths: [] };

  const hadiths = await prisma.hadith.findMany({
    where: { chapter: { id: chapter.id } },
    include: {
      chapter: true,
      narrator: true,
      mentionedSahabas: true,
    },
    orderBy: { numero: "asc" },
  });

  // Parse hadiths
  const hadithsParsed = z.array(HadithSchema).parse(hadiths);
  return { chapter, hadiths: hadithsParsed };
}

// Get all narrators with hadith count
export async function getAllNarrators(): Promise<PersonType[]> {
  const narrators = await prisma.narrator.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { narratedHadiths: true } },
    },
    orderBy: { name: "asc" },
  });
  // Map to PersonType with hadithCount
  return narrators.map((narrator) => ({
    id: narrator.id,
    name: narrator.name,
    slug: narrator.slug,
    hadithCount: narrator._count.narratedHadiths,
  }));
}

// Get a single narrator by slug
export async function getNarratorBySlug(
  slug: string
): Promise<PersonType | null> {
  // Fetch narrator by slug
  const narrator = await prisma.narrator.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { narratedHadiths: true } },
    },
  });
  // Return mapped narrator or null
  return narrator
    ? {
        id: narrator.id,
        name: narrator.name,
        slug: narrator.slug,
        hadithCount: narrator._count.narratedHadiths,
      }
    : null;
}

// Get a narrator and their hadiths
export async function getNarratorWithHadiths(slug: string): Promise<{
  narrator: PersonType | null;
  hadiths: HadithType[];
}> {
  const narrator = await getNarratorBySlug(slug);

  if (!narrator) return { narrator: null, hadiths: [] };

  const hadiths = await prisma.hadith.findMany({
    where: { narrator: { name: narrator.name } },
    include: {
      chapter: true,
      narrator: true,
      mentionedSahabas: true,
    },
    orderBy: { numero: "asc" },
  });

  // Parse hadiths
  const hadithsParsed = z.array(HadithSchema).parse(hadiths);
  return { narrator, hadiths: hadithsParsed };
}

// Get all narrator names
export async function getNarratorNames(): Promise<string[]> {
  // Fetch all narrator names
  const narrators = await prisma.narrator.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });
  // Map to array of names
  return narrators.map((n) => n.name);
}

// Get all sahabas with hadith count
export async function getAllSahabas(): Promise<PersonType[]> {
  const sahabas = await prisma.sahaba.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { mentionedInHadiths: true } },
    },
    orderBy: { name: "asc" },
  });
  // Map to PersonType with hadithCount
  return sahabas.map((sahaba) => ({
    id: sahaba.id,
    name: sahaba.name,
    slug: sahaba.slug,
    hadithCount: sahaba._count.mentionedInHadiths,
  }));
}

// Get a single sahaba by slug
export async function getSahabaBySlug(
  slug: string
): Promise<PersonType | null> {
  const sahaba = await prisma.sahaba.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { mentionedInHadiths: true } },
    },
  });
  // Return mapped sahaba or null
  return sahaba
    ? {
        id: sahaba.id,
        name: sahaba.name,
        slug: sahaba.slug,
        hadithCount: sahaba._count.mentionedInHadiths,
      }
    : null;
}

// Get a sahaba and their hadiths
export async function getSahabaWithHadiths(slug: string): Promise<{
  sahaba: PersonType | null;
  hadiths: HadithType[];
}> {
  // Fetch sahaba
  const sahaba = await getSahabaBySlug(slug);

  if (!sahaba) return { sahaba: null, hadiths: [] };

  const hadiths = await prisma.hadith.findMany({
    where: { mentionedSahabas: { some: { name: sahaba.name } } },
    include: {
      chapter: true,
      narrator: true,
      mentionedSahabas: true,
    },
    orderBy: { numero: "asc" },
  });
  // Parse hadiths
  const hadithsParsed = z.array(HadithSchema).parse(hadiths);
  return { sahaba, hadiths: hadithsParsed };
}

// Get all sahaba names
export async function getSahabaNames(): Promise<string[]> {
  const sahabas = await prisma.sahaba.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });
  // Map to array of names
  return sahabas.map((sahaba) => sahaba.name);
}
