import { Prisma } from "@prisma/client";

export type HadithType = Prisma.HadithGetPayload<{
  include: {
    chapter: true;
    narrator: true;
    mentionedSahabas: true;
  };
}>;

export type FilterType = "word" | "narrator" | "sahaba";
