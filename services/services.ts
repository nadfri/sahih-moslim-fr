import { chapters } from '@/db/chapterTitles';
import { moslim_fr } from '@/db/moslim_fr';
import { narrators } from '@/db/narrators';
import { sahabas } from '@/db/sahabas';
import {
  ChapterSlugType,
  ChapterType,
  HadithType,
  NarratorType,
  SahabaType,
} from '@/types/types';

export function getAllHadiths() {
  return moslim_fr;
}

export function getHadithById(id: number): HadithType | undefined {
  return moslim_fr.find((hadith) => hadith.id === id);
}

export function getHadithByChapterSlug(chapterSlug: ChapterSlugType): HadithType[] {
  return moslim_fr.filter((hadith) => hadith.chapterSlug === chapterSlug);
}

export function getHadithByNarrator(narrator: NarratorType): HadithType[] {
  return moslim_fr.filter((hadith) => hadith.narrator === narrator);
}

export function getHadithBySahaba(sahaba: SahabaType): HadithType[] {
  return moslim_fr.filter((hadith) => hadith.sahabas.includes(sahaba));
}

export function getHadithCount(): number {
  return moslim_fr.length;
}

export function getAllNarrators(): NarratorType[] {
  return narrators;
}

export function getAllChapters(): ChapterType[] {
  return [...chapters];
}

export function getChapterBySlug(
  chapterSlug: ChapterSlugType
): ChapterType | undefined {
  const chapter = chapters.find((chapter) => chapter.slug === chapterSlug);
  return chapter;
}

export function getAllSahabas(): SahabaType[] {
  return sahabas;
}
