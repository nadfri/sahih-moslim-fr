import { HadithType } from "../../types/types";

export const mockHadith: HadithType = {
  id: "1",
  numero: 123,
  matn_fr: "Ceci est un **test** de hadith en français.",
  matn_ar: "هذا اختبار للحديث باللغة العربية",
  isnad: null,
  chapter: {
    id: "ch1",
    name: "Test Chapter",
    slug: "test-chapter",
    hadithCount: 10,
  },
  narrator: {
    id: "n1",
    name: "Abu Test",
    slug: "abu-test",
    hadithCount: 5,
    nameArabic: null,
  },
  mentionedSahabas: [
    {
      id: "s1",
      name: "Sahaba Test 1",
      slug: "sahaba-test-1",
      hadithCount: 3,
      nameArabic: null,
    },
    {
      id: "s2",
      name: "Sahaba Test 2",
      slug: "sahaba-test-2",
      hadithCount: 0,
      nameArabic: null,
    },
  ],
};
