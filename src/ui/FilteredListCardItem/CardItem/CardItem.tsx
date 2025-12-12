import { Link } from "@/i18n/navigation";
import { MoveRight } from "lucide-react";

import { ItemType, VariantType } from "@/src/types/types";
import { ChapterIndex } from "@/src/ui/FilteredListCardItem/CardItem/ChapterIndex/ChapterIndex";
import { useLocale, useTranslations } from "next-intl";
import { BadgeNumberOfHadith } from "../../hadith/BadgeNumberOfHadith/BadgeNumberOfHadith";
import { getLocalizedName } from "@/src/utils/getLocalizedName";

type Props = {
  item: ItemType;
  variant: VariantType;
};

export function CardItem({ item, variant }: Props) {
  const t = useTranslations("search");

  const locale = useLocale();

  return (
    <Link
      href={`/${variant}/${item.slug}`}
      aria-label={t("see-item", { item: getLocalizedName(item, locale) })}
      key={item.id}
      className="group block h-full"
    >
      <div className="bg-white/5 dark:bg-white/5 rounded-xl shadow-lg overflow-hidden h-full flex flex-col p-3 transition-all duration-200 ease-in-out border border-white/10 dark:border-white/10 group-hover:shadow-xl group-hover:border-emerald-300 dark:group-hover:border-emerald-700 group-hover:-translate-y-1 backdrop-blur-xl">
        {/* Main card content */}
        <div className="flex flex-col grow">
          {/* Styled chapter number */}
          {item.index != null && <ChapterIndex index={item.index} />}

          {/* Chapter Name */}
          <h2 className="text-xl font-semibold font-serif text-emerald-700 dark:text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors grow flex items-center">
            {getLocalizedName(item, locale)}
          </h2>
        </div>

        {/* Navigation indicator (appears more clearly on hover) */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {t("explore")}
            <MoveRight className="h-4 w-4 ms-1 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </p>

          <BadgeNumberOfHadith count={item.hadithCount} />
        </div>
      </div>
    </Link>
  );
}
