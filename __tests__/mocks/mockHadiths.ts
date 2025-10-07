import { HadithType } from "@/src/types/types";

export const mockHadiths: HadithType[] = [
  {
    id: "1",
    numero: 101,
    matn_fr: "Premier hadith",
    matn_ar: "أول حديث",
    chapter: {
      id: "ch1",
      name_fr: "Test Chapter",
      name_ar: "اختبار الفصل",
      name_en: "Test Chapter",
      slug: "test-chapter",
      hadithCount: 10,
    },
    mentionedSahabas: [
      {
        id: "s1",
        name_fr: "Abu Hurayra",
        name_ar: "أبو هريرة",
        name_en: "Abu Hurayra",
        slug: "abu-hurayra",
        hadithCount: 10,
      },
    ],
    isnadTransmitters: [
      {
        id: "t1",
        name_fr: "Transmetteur 1",
        name_ar: "ناقل 1",
        name_en: "Transmitter 1",
        slug: "transmetteur-1",
        hadithCount: 3,
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
      name_fr: "Test Chapter",
      name_ar: "اختبار الفصل",
      name_en: "Test Chapter",
      slug: "test-chapter",
      hadithCount: 10,
    },
    mentionedSahabas: [
      {
        id: "s2",
        name_fr: "Ibn Abbas",
        name_ar: "ابن عباس",
        name_en: "Ibn Abbas",
        slug: "ibn-abbas",
        hadithCount: 8,
      },
    ],
    isnadTransmitters: [
      {
        id: "t2",
        name_fr: "Transmetteur 2",
        name_ar: "ناقل 2",
        name_en: "Transmitter 2",
        slug: "transmetteur-2",
        hadithCount: 2,
      },
    ],
  },
];
