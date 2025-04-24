import { prisma } from "@/prisma/prisma";
import { HadithType } from "../types/types";

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

// /* Get by Chapter */
// export function getAllChapters() {
//   return [...chapters];
// }

// export function getHadithByChapterSlug(chapterSlug: string): HadithType[] {
//   return moslim_fr.filter((hadith) => slugify(hadith.chapter) === chapterSlug);
// }

// export function getChapterBySlug(chapterSlug: string): string | undefined {
//   const chapter = chapters.find((chapter) => slugify(chapter) === chapterSlug);
//   return chapter;
// }

// /*Get By Narrator*/
// export function getAllNarrators() {
//   return narrators;
// }

// export function getHadithByNarratorSlug(narratorSlug: string): HadithType[] {
//   return moslim_fr.filter(
//     (hadith) => slugify(hadith.narrator) === narratorSlug
//   );
// }

// export function getNarratorBySlug(narratorSlug: string): string | undefined {
//   return narrators.find((narrator) => slugify(narrator) === narratorSlug);
// }

// export function getCountHadithsByNarratorSlug(narratorSlug: string): number {
//   return getHadithByNarratorSlug(narratorSlug).length;
// }

// /**Get By Sahaba*/
// export function getAllSahabas() {
//   return sahabas;
// }

// export function getHadithBySahabaSlug(sahabaSlug: string): HadithType[] {
//   return moslim_fr.filter((hadith) => {
//     const sahabas = hadith.sahabas;

//     if (sahabas.length === 0) return false;

//     const sahabasSlugs = sahabas.map((sahaba) => slugify(sahaba));

//     return sahabasSlugs.includes(sahabaSlug);
//   });
// }

// export function getSahabaBySlug(sahabaSlug: string): string | undefined {
//   return sahabas.find((sahaba) => slugify(sahaba) === sahabaSlug);
// }

// export function getCountHadithsBySahabaSlug(sahabaSlug: string): number {
//   return getHadithBySahabaSlug(sahabaSlug).length;
// }

// export function getIds() {
//   return moslim_fr.map((hadith) => hadith.id);
// }
