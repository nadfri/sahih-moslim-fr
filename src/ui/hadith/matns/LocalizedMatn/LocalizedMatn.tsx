import { useLocale } from "next-intl";
import { Matn } from "@/src/ui/hadith/matns/Matn/Matn";
import { HadithType } from "@/src/types/types";

type Props = {
  hadith: HadithType;
  highlight?: string;
};

export function LocalizedMatn({ hadith, highlight }: Props) {
  const locale = useLocale();

  // Choose the appropriate text and language based on locale
  if (locale === "ar" && hadith.matn_ar) {
    return (
      <Matn
        matn={hadith.matn_ar}
        lang="ar"
        highlight={highlight}
        showToggle={false}
      />
    );
  }

  if (locale === "en" && hadith.matn_en) {
    return (
      <Matn
        matn={hadith.matn_en}
        lang="en"
        highlight={highlight}
      />
    );
  }

  // Default to French
  return (
    <Matn
      matn={hadith.matn_fr}
      lang="fr"
      highlight={highlight}
    />
  );
}
