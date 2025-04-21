export type HadithType = {
  id: number;
  chapter: string;
  narrator: string;
  sahabas: string[];
  matn: string;
  arabic: string;
  isnad?: string;
};
