"use client";
import { useAuth } from "@/src/hooks/useAuth";
import { HadithType } from "@/src/types/types";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { BadgeNumberOfHadith } from "@/src/ui/hadith/BadgeNumberOfHadith/BadgeNumberOfHadith";
import { useTranslations } from "next-intl";

type ListLayoutHadithProps = {
  title?: string;
  name?: string;
  hadiths: HadithType[];
};

export function ListLayoutHadith({
  title,
  name,
  hadiths,
}: ListLayoutHadithProps) {
  const { isAdmin } = useAuth();
  const t = useTranslations("hadith");

  return (
    <>
      {title && (
        <h1 className="title">
          {title}{" "}
          <p className="text-emerald-900 dark:text-emerald-300">{name}</p>
        </h1>
      )}

      <BadgeNumberOfHadith
        count={hadiths.length}
        size="large"
      />

      {hadiths.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          {t("noResults")}
        </p>
      ) : (
        <div className="space-y-8">
          {hadiths.map((hadith) => (
            <Hadith
              key={hadith.id}
              hadith={hadith}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </>
  );
}
