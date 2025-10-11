/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllChapters } from "@/src/services/services";
import { ParamsLocale } from "@/src/types/types";
import { FilteredListCard } from "@/src/ui/FilteredListCard/FilteredListCard";
import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

export default async function ChaptersPage({
  params,
}: {
  params: ParamsLocale;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("chapters");
  const chapters = await getAllChapters();

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">{t("title")}</h1>

      <FilteredListCard
        items={chapters}
        variant="chapters"
      />
    </div>
  );
}

// Generate static metadata
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("chapters");

  const title = `${t("title-metadata")} | Moslim`;
  const description = t("description-metadata");

  return {
    title,
    description,
  };
}
