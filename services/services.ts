import { chapters } from '@/db/chapterTitles';
import { moslim_fr } from '@/db/moslim_fr';
import { narrators } from '@/db/narrators';
import { sahabas } from '@/db/sahabas';
import {
  ChapterSlugType,
  ChapterType,
  HadithType,
  NarratorSlugType,
  NarratorType,
  SahabaType,
} from '@/types/types';

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
export function getHadithByChapterSlug(chapterSlug: ChapterSlugType): HadithType[] {
  return moslim_fr.filter((hadith) => hadith.chapterSlug === chapterSlug);
}

export function getAllChapters(): ChapterType[] {
  return [...chapters];
}

export function getChapterBySlug(chapterSlug: ChapterSlugType): ChapterType | undefined {
  const chapter = chapters.find((chapter) => chapter.slug === chapterSlug);
  return chapter;
}

/*Get By Narrator*/
export function getHadithByNarratorSlug(narratorSlug: NarratorSlugType): HadithType[] {
  return moslim_fr.filter((hadith) => hadith.narratorSlug === narratorSlug);
}

export function getAllNarrators(): NarratorType[] {
  return [...narrators];
}

export function getNarratorBySlug(
  narratorSlug: NarratorSlugType
): NarratorType | undefined {
  return narrators.find((narrator) => narrator.slug === narratorSlug);
}

/**Get By Sahaba*/
export function getHadithBySahaba(sahaba: SahabaType): HadithType[] {
  return moslim_fr.filter((hadith) => hadith.sahabas.includes(sahaba));
}

export function getAllSahabas(): SahabaType[] {
  return sahabas;
}
