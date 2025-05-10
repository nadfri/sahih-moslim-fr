import { HadithType } from "@/src/types/types";

export const mockHadiths: HadithType[] = [
  {
    id: "1",
    numero: 101,
    matn_fr: "Premier hadith",
    matn_ar: "أول حديث",
    isnad: null,
    chapter: {
      id: "ch1",
      name: "Test Chapter",
      slug: "test-chapter",
      hadithCount: 10,
    },
    narrator: {
      id: "n1",
      name: "Narrateur 1",
      slug: "narrateur-1",
      hadithCount: 5,
      nameArabic: null,
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
  },
  {
    id: "2",
    numero: 102,
    matn_fr: "Deuxième hadith",
    matn_ar: "ثاني حديث",
    isnad: null,
    chapter: {
      id: "ch1",
      name: "Test Chapter",
      slug: "test-chapter",
      hadithCount: 10,
    },
    narrator: {
      id: "n2",
      name: "Narrateur 2",
      slug: "narrateur-2",
      hadithCount: 3,
      nameArabic: null,
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
  },
];
