import { Chapter } from "@prisma/client"; // Ensure Chapter type is imported

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

// export function getHadithCount(): number {
//   return moslim_fr.length;
// }

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

// export function getChapterBySlug(chapterSlug: string): string | undefined { // This function is replaced by getChapterByTitle
// ...existing code...
// }

// /*Get By Narrator*/
// ...existing code...

// /**Get By Sahaba*/
// ...existing code...

// export function getIds() {
// ...existing code...
// }
