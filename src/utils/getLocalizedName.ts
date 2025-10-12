import { Locale } from "next-intl";
import { ItemType } from "../types/types";

export function getLocalizedName(item: ItemType, locale: Locale): string {
  if (locale === "ar" && item.name_ar) {
    return item.name_ar;
  }

  if (locale === "en" && item.name_en) {
    return item.name_en;
  }

  return item.name_fr;
}
