import { chapterTitles } from '@/db/chapterTitles';
import { narrators } from '@/db/narrators';
import { sahabas } from '@/db/sahabas';

export type ChapterType = (typeof chapterTitles)[number];
export type SahabaType = (typeof sahabas)[number];
export type NarratorType = (typeof narrators)[number];

export type HadithType = {
  id: number;
  chapter: ChapterType;
  narrator: NarratorType;
  sahabas: SahabaType[];
  matn: string;
  isnad?: string;
};
