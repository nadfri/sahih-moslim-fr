import { chapters } from "@/db/chapterTitles";
import { moslim_fr } from "@/db/moslim_fr";
import { narrators } from "@/db/narrators";
import { sahabas } from "@/db/sahabas";
import { ChapterType, HadithType, NarratorType, SahabaType } from "@/types/types";
import { slugify } from "@/utils/slugify";

/*Get By Hadith*/
export function getAllHadiths() {
  return moslim_fr;
}

export function getHadithById(id: number): HadithType | undefined {
  return moslim_fr.find((hadith) => hadith.id === id);
}

export function getHadithCount(): number {
  return moslim_fr.length;
}

/* Get by Chapter */
export function getAllChapters(): ChapterType[] {
  return [...chapters];
}

export function getHadithByChapterSlug(chapterSlug: string): HadithType[] {
  return moslim_fr.filter((hadith) => slugify(hadith.chapter) === chapterSlug);
}

export function getChapterBySlug(chapterSlug: string): ChapterType | undefined {
  const chapter = chapters.find((chapter) => slugify(chapter.title) === chapterSlug);
  return chapter;
}

/*Get By Narrator*/
export function getAllNarrators(): NarratorType[] {
  return [...narrators];
}

export function getHadithByNarratorSlug(narratorSlug: string): HadithType[] {
  return moslim_fr.filter((hadith) => slugify(hadith.narrator) === narratorSlug);
}

export function getNarratorBySlug(narratorSlug: string): NarratorType | undefined {
  return narrators.find((narrator) => slugify(narrator) === narratorSlug);
}

/**Get By Sahaba*/
export function getAllSahabas(): SahabaType[] {
  return sahabas;
}

export function getHadithBySahabaSlug(sahabaSlug: string): HadithType[] {
  return moslim_fr.filter((hadith) => {
    const sahabas = hadith.sahabas;

    if (sahabas.length === 0) return false;

    const sahabasSlugs = sahabas.map((sahaba) => slugify(sahaba));

    return sahabasSlugs.includes(sahabaSlug);
  });
}

export function getSahabaBySlug(sahabaSlug: string): SahabaType | undefined {
  return sahabas.find((sahaba) => slugify(sahaba) === sahabaSlug);
}
