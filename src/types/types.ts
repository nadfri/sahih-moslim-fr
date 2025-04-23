export type HadithType = {
  id: number;
  chapter: string;
  narrator: string;
  sahabas: string[];
  matn_fr: string;
  matn_ar: string;
  isnad?: string;
};

export type FilterType = "word" | "narrator" | "sahaba";
