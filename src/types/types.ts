import { chapters } from "@/db/chapterTitles";
import { narrators } from "@/db/narrators";
import { sahabas } from "@/db/sahabas";

export type SahabaType = (typeof sahabas)[number];
export type NarratorType = (typeof narrators)[number];
export type ChapterType = (typeof chapters)[number];
export type ChapterTitleType = ChapterType["title"];

export type HadithType = {
  id: number;
  chapter: ChapterTitleType;
  narrator: NarratorType;
  sahabas: SahabaType[];
  matn: string;
  arabic: string;
  isnad?: string;
};
