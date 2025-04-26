import { Prisma } from "@prisma/client";

export type HadithType = Prisma.HadithGetPayload<{
  include: {
    chapter: true;
    narrator: true;
    mentionedSahabas: true;
  };
}>;

export type FilterType = "word" | "narrator" | "sahaba";

export type PersonType = {
  id: string;
  name: string;
  nameArabic?: string | null;
  hadithCount: number;
};

export type ChapterType = {
  id: string;
  title: string;
  hadithCount: number;
};
