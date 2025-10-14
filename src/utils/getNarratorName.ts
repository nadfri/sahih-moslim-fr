import { Locale } from "next-intl";
import { HadithType } from "../types/types";

export function getNarratorName(
  hadith: HadithType,
  locale: Locale
): string | undefined {
  const narrator =
    hadith?.isnadTransmitters[hadith.isnadTransmitters.length - 1];

  if (!narrator) {
    return undefined;
  }

  if (locale === "ar" && narrator.name_ar) {
    return narrator.name_ar;
  }

  if (locale === "en" && narrator.name_en) {
    return narrator.name_en;
  }

  return narrator.name_fr;
}
