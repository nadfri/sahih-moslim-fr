import { chapters } from '@/db/chapterTitles';
import { narrators } from '@/db/narrators';
import { sahabas } from '@/db/sahabas';

export type SahabaType = (typeof sahabas)[number];

export type NarratorType = (typeof narrators)[number];
export type NarratorNameType = NarratorType['name'];
export type NarratorSlugType = NarratorType['slug'];

export type ChapterType = (typeof chapters)[number];
export type ChapterTitleType = ChapterType['title'];
export type ChapterSlugType = ChapterType['slug'];

export type HadithType = {
  id: number;
  chapterSlug: ChapterSlugType;
  narratorSlug: NarratorSlugType;
  sahabas: SahabaType[];
  matn: string;
  isnad?: string;
  arabic?: string;
};
