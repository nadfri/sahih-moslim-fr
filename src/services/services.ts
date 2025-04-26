import { notFound } from "next/navigation";
import { Chapter, Narrator, Sahaba } from "@prisma/client";

import { prisma } from "@/prisma/prisma";
import { HadithType } from "../types/types";
import { slugify } from "../utils/slugify";

/*Get By Hadith*/
export function getAllHadiths() {
  const hadiths = prisma.hadith.findMany({
    include: {
      chapter: true,
      narrator: true,
      mentionedSahabas: true,
    },
    orderBy: {
      numero: "asc",
    },
  });
  return hadiths;
}

export async function getHadithByNumero(
  numero: string
): Promise<HadithType | undefined> {
  const hadith = await prisma.hadith.findUnique({
    where: { numero: parseInt(numero) },
    include: {
      chapter: true,
      narrator: true,
      mentionedSahabas: true,
    },
  });
  return hadith || undefined;
}

/* Get by Chapter */
export async function getAllChapters() {
  const chaptersWithCount = await prisma.chapter.findMany({
    select: {
      title: true,
      _count: {
        select: { hadiths: true },
      },
    },
  });

  return chaptersWithCount.map((chapter) => ({
    title: chapter.title,
    hadithCount: chapter._count.hadiths,
  }));
}

export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  const allChapters = await prisma.chapter.findMany();

  const chapter = allChapters.find(
    (chapter) => slugify(chapter.title) === slug
  );

  return chapter || null;
}

export async function getChapterByTitle(
  chapterTitle: string
): Promise<Chapter | null> {
  const chapter = await prisma.chapter.findUnique({
    where: { title: chapterTitle },
  });
  return chapter;
}

export async function getHadithByChapterSlug(
  slug: string
): Promise<HadithType[]> {
  const chapter = await getChapterBySlug(slug);

  if (!chapter) {
    return [];
  }

  const hadithsByChapter = await prisma.hadith.findMany({
    where: { chapter: { title: chapter.title } },
    include: {
      chapter: true,
      narrator: true,
      mentionedSahabas: true,
    },
    orderBy: {
      numero: "asc",
    },
  });

  return hadithsByChapter;
}

export async function getChapterWithHadiths(slug: string): Promise<{
  chapter: Chapter | null;
  hadiths: HadithType[];
}> {
  // Get all chapters to find the one matching the slug
  const allChapters = await prisma.chapter.findMany();

  // Find the chapter where the slugified title matches the provided slug
  const chapter = allChapters.find(
    (chapter) => slugify(chapter.title) === slug
  );

  if (!chapter) {
    return { chapter: null, hadiths: [] };
  }

  // Get hadiths for this chapter
  const hadiths = await prisma.hadith.findMany({
    where: { chapter: { title: chapter.title } },
    include: {
      chapter: true,
      narrator: true,
      mentionedSahabas: true,
    },
    orderBy: {
      numero: "asc",
    },
  });

  return { chapter, hadiths };
}

//Get Hadiths by Sahabas
export async function getAllSahabas() {
  // Get all sahabas with the count of hadiths that mention them
  const sahabas = await prisma.sahaba.findMany({
    select: {
      name: true,
      _count: {
        select: { mentionedInHadiths: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return sahabas.map((sahaba) => ({
    name: sahaba.name,
    hadithCount: sahaba._count.mentionedInHadiths,
  }));
}

export async function getSahabaWithHadiths(
  slug: string
): Promise<{ sahaba: Sahaba | null; hadiths: HadithType[] }> {
  // Get all sahabas to find the one matching the slug
  const allSahabas = await prisma.sahaba.findMany();

  // Find the sahaba where the slugified name matches the provided slug
  const sahaba = allSahabas.find((sahaba) => slugify(sahaba.name) === slug);

  if (!sahaba) {
    return { sahaba: null, hadiths: [] };
  }

  // Get hadiths that mention this sahaba
  const hadiths = await prisma.hadith.findMany({
    where: { mentionedSahabas: { some: { name: sahaba.name } } },
    include: {
      chapter: true,
      narrator: true,
      mentionedSahabas: true,
    },
    orderBy: {
      numero: "asc",
    },
  });

  return { sahaba, hadiths };
}

export async function getSahabaBySlug(slug: string): Promise<Sahaba | null> {
  const allSahabas = await prisma.sahaba.findMany();

  const sahaba = allSahabas.find((sahaba) => slugify(sahaba.name) === slug);

  return sahaba || null;
}

//Get hadiths by Narrators
export async function getAllNarrators() {
  // Get all narrators with the count of hadiths that mention them
  const narrators = await prisma.narrator.findMany({
    select: {
      name: true,
      _count: {
        select: { narratedHadiths: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return narrators.map((narrator) => ({
    name: narrator.name,
    hadithCount: narrator._count.narratedHadiths,
  }));
}

export async function getNarratorWithHadiths(
  slug: string
): Promise<{ narrator: Narrator | null; hadiths: HadithType[] }> {
  // Get all narrators to find the one matching the slug
  const allNarrators = await prisma.narrator.findMany();

  // Find the narrator where the slugified name matches the provided slug
  const narrator = allNarrators.find(
    (narrator) => slugify(narrator.name) === slug
  );

  if (!narrator) {
    return notFound();
  }

  const hadiths = await prisma.hadith.findMany({
    where: { narrator: { name: narrator.name } },
    include: {
      chapter: true,
      narrator: true,
      mentionedSahabas: true,
    },
    orderBy: {
      numero: "asc",
    },
  });

  return { narrator, hadiths };
}

export async function getNarratorBySlug(
  slug: string
): Promise<Narrator | null> {
  const allNarrators = await prisma.narrator.findMany();

  const narrator = allNarrators.find(
    (narrator) => slugify(narrator.name) === slug
  );

  return narrator || null;
}

// New functions for search page
export async function getNarratorNames(): Promise<string[]> {
  const narrators = await prisma.narrator.findMany({
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return narrators.map((narrator) => narrator.name);
}

export async function getSahabaNames(): Promise<string[]> {
  const sahabas = await prisma.sahaba.findMany({
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return sahabas.map((sahaba) => sahaba.name);
}
