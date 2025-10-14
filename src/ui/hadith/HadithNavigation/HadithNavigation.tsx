import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  previousNumero?: number;
  nextNumero?: number;
};

export function HadithNavigation({ previousNumero, nextNumero }: Props) {
  const t = useTranslations("hadith.ActionsBtns");
  return (
    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      {/* Previous Button */}
      {previousNumero ? (
        <Link
          href={`/hadith/${previousNumero}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 shadow-sm hover:shadow-md"
          title={`Hadith précédent n°${previousNumero}`}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
          <span>{t("previous", { numero: previousNumero })}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Next Button */}
      {nextNumero ? (
        <Link
          href={`/hadith/${nextNumero}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 shadow-sm hover:shadow-md"
          title={`Hadith suivant n°${nextNumero}`}
        >
          <span>{t("next", { numero: nextNumero })}</span>
          <ChevronRight className="size-4 rtl:rotate-180" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
