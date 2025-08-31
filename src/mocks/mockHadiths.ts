import { HadithType } from "@/src/types/types";

export const mockHadiths: HadithType[] = [
  {
    id: "1",
    numero: 101,
    matn_fr: "Premier hadith",
    matn_ar: "أول حديث",
    chapter: {
      id: "ch1",
      name: "Test Chapter",
      slug: "test-chapter",
      hadithCount: 10,
    },
    mentionedSahabas: [
      {
        id: "s1",
        name: "Abu Hurayra",
        slug: "abu-hurayra",
        hadithCount: 10,
        nameArabic: "أبو هريرة",
      },
    ],
    isnadTransmitters: [
      {
        id: "t1",
        name: "Transmetteur 1",
        slug: "transmetteur-1",
        hadithCount: 3,
        nameArabic: null,
      },
    ],
  },
  {
    id: "2",
    numero: 102,
    matn_fr: "Deuxième hadith",
    matn_ar: "ثاني حديث",
    chapter: {
      id: "ch1",
      name: "Test Chapter",
      slug: "test-chapter",
      hadithCount: 10,
    },
    mentionedSahabas: [
      {
        id: "s2",
        name: "Ibn Abbas",
        slug: "ibn-abbas",
        hadithCount: 8,
        nameArabic: "ابن عباس",
      },
    ],
    isnadTransmitters: [
      {
        id: "t2",
        name: "Transmetteur 2",
        slug: "transmetteur-2",
        hadithCount: 2,
        nameArabic: null,
      },
    ],
  },
];
