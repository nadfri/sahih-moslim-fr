import { ChapterType } from './ChapterType';
import { NarratorType } from './NarratorType';
import { SahabaType } from './SahabaType';

export type HadithType = {
  id: number;
  chapter: ChapterType;
  narrator: NarratorType;
  sahabas: SahabaType[];
  text: string;
};
