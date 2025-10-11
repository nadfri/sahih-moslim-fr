import { Link } from "@/i18n/navigation";
import { LinkIcon } from "lucide-react";

import { ItemType } from "@/src/types/types";
import { useTranslations } from "next-intl";

export function NarratedBy({ narrator }: { narrator: ItemType }) {
  const t = useTranslations("hadith");

  return (
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {t("from")}
      <Link
        href={`/transmitters/${narrator.slug}`}
        aria-label={t("see-transmitter", { transmitter: narrator.name_fr })}
        className="font-medium text-emerald-700 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400 hover:underline transition-colors duration-200"
      >
        {narrator.name_fr} <LinkIcon className="inline size-3 align-middle" />
      </Link>
    </p>
  );
}
