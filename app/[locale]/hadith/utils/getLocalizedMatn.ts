import { Locale } from "next-intl";
import { HadithType } from "@/src/types/types";

export function getLocalizedMatn(hadith: HadithType, locale: Locale): string {
  if (locale === "ar" && hadith.matn_ar) {
    return hadith.matn_ar;
  }

  if (locale === "en" && hadith.matn_en) {
    return hadith.matn_en;
  }

  return hadith.matn_fr;
}
