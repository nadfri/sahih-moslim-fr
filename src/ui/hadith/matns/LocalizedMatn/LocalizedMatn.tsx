import { useLocale } from "next-intl";
import { Matn_fr } from "@/src/ui/hadith/matns/Matn_fr/Matn_fr";
import { Matn_ar } from "@/src/ui/hadith/matns/Matn_ar/Matn_ar";
import { Matn_en } from "@/src/ui/hadith/matns/Matn_en/Matn_en";
import { HadithType } from "@/src/types/types";

type Props = {
  hadith: HadithType;
  highlight?: string;
  edit?: boolean;
};

export function LocalizedMatn({ hadith, highlight, edit }: Props) {
  const locale = useLocale();

  // Choose the appropriate component based on locale and available text
  if (locale === "ar" && hadith.matn_ar) {
    return (
      <Matn_ar
        matn={hadith.matn_ar}
        highlight={highlight}
        edit={edit}
      />
    );
  }

  if (locale === "en" && hadith.matn_en) {
    return (
      <Matn_en
        matn={hadith.matn_en}
        highlight={highlight}
      />
    );
  }

  // Default to French
  return (
    <Matn_fr
      matn={hadith.matn_fr}
      highlight={highlight}
    />
  );
}
