import { HadithType } from "../../src/types/types";

export const mockHadith: HadithType = {
  id: "1",
  numero: 123,
  matn_fr: "Ceci est un **test** de hadith en français.",
  matn_ar: "هذا اختبار للحديث باللغة العربية",
  matn_en: "This is a **test** of hadith in English.",
  chapter: {
    id: "ch1",
    name_fr: "Test Chapter",
    slug: "test-chapter",
    hadithCount: 10,
  },
  mentionedSahabas: [
    {
      id: "s1",
      name_fr: "Sahaba Test 1",
      slug: "sahaba-test-1",
      hadithCount: 3,
      name_ar: null,
      name_en: null,
    },
    {
      id: "s2",
      name_fr: "Sahaba Test 2",
      slug: "sahaba-test-2",
      hadithCount: 0,
      name_ar: null,
      name_en: null,
    },
  ],
  isnadTransmitters: [
    {
      id: "t1",
      name_fr: "Transmitter Test 1",
      slug: "transmitter-test-1",
      hadithCount: 2,
      name_ar: null,
      name_en: null,
    },
    {
      id: "t2",
      name_fr: "Transmitter Test 2",
      slug: "transmitter-test-2",
      hadithCount: 1,
      name_ar: null,
      name_en: null,
    },
  ],
};
