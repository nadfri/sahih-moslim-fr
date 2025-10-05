import { useTranslations } from "next-intl";

export function ChapterIndex({ index }: { index: number | null | undefined }) {
  const t = useTranslations("search");

  if (index === undefined || index === null)
    return <p className="px-3 py-1 mb-2 h-6"></p>;

  return (
    <p className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full mb-2 w-fit ms-auto">
      {t("chapterIndex", { index })}
    </p>
  );
}
