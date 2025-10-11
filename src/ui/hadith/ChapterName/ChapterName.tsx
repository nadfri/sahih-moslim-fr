import { Link } from "@/i18n/navigation";
import { HadithType } from "@/src/types/types";
import { ArabicIcon } from "../../icons/ArabicIcon";
import { LinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function ChapterName({ hadith }: { hadith: HadithType }) {
  const t = useTranslations("hadith");
  return (
    <div className="flex items-center justify-between mb-2">
      <Link
        href={`/chapters/${hadith.chapter.slug}`}
        aria-label={t("see-chapter", { chapter: hadith.chapter.name_fr })}
        className="text-sm font-medium text-amber-700 dark:text-amber-500 tracking-wide uppercase inline-flex items-center hover:text-amber-900 dark:hover:text-amber-400 hover:underline transition-colors duration-200"
      >
        <ArabicIcon className="me-1 h-5" /> {hadith.chapter.name_fr}
        <LinkIcon className="inline size-3 align-middle ms-1" />
      </Link>

      <div className="flex items-center gap-2">
        <span className="bg-emerald-600 dark:bg-emerald-700 text-white text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
          {hadith.numero}
        </span>
      </div>
    </div>
  );
}
