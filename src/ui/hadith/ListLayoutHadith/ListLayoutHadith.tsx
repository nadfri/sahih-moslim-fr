"use client";
import { useAuth } from "@/src/hooks/useAuth";
import { HadithType } from "@/src/types/types";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { BadgeNumberOfHadith } from "@/src/ui/hadith/BadgeNumberOfHadith/BadgeNumberOfHadith";
import { useTranslations } from "next-intl";
import { ArabicIcon } from "../../icons/ArabicIcon";

type ListLayoutHadithProps = {
  title?: string;
  name?: string;
  hadiths: HadithType[];
  highlight?: string;
};

export function ListLayoutHadith({
  title,
  name,
  hadiths,
  highlight = "",
}: ListLayoutHadithProps) {
  const { isAdmin } = useAuth();
  const t = useTranslations("hadith");

  // Determine empty message based on context
  const emptyMessage = t("noResults");

  return (
    <>
      {title && (
        <h1 className="title">
          {title}{" "}
          <p className="text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-1 w-fit m-auto rounded-xl px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30">
            <ArabicIcon className="h-5" />
            {name}
            <ArabicIcon className="h-5" />
          </p>
        </h1>
      )}

      <BadgeNumberOfHadith
        count={hadiths.length}
        size="large"
      />

      {hadiths.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          {emptyMessage}
        </p>
      )}

      {hadiths.length > 0 && (
        <div className="space-y-8">
          {hadiths.map((hadith) => (
            <Hadith
              key={hadith.id}
              hadith={hadith}
              highlight={highlight}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </>
  );
}
