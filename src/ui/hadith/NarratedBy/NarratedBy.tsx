import { Link } from "@/i18n/navigation";
import { LinkIcon } from "lucide-react";

import { ItemType } from "@/src/types/types";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedName } from "@/src/utils/getLocalizedName";

export function NarratedBy({ narrator }: { narrator: ItemType }) {
  const t = useTranslations("hadith");
  const locale = useLocale();

  return (
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {" "}
      <span>{t("from")}</span>{" "}
      <Link
        href={`/transmitters/${narrator.slug}`}
        aria-label={t("see-transmitter", {
          transmitter: getLocalizedName(narrator, locale),
        })}
        className="font-medium text-emerald-700 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400 hover:underline transition-colors duration-200"
      >
        {getLocalizedName(narrator, locale)}
        <LinkIcon className="inline size-3 align-middle ms-0.5" />
      </Link>
    </p>
  );
}
