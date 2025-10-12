/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllSahabas } from "@/src/services/services";
import { ParamsLocale } from "@/src/types/types";
import { FilteredListCardItem } from "@/src/ui/FilteredListCardItem/FilteredListCardItem";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

export default async function SahabasPage({
  params,
}: {
  params: ParamsLocale;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("sahabas");

  const sahabas = await getAllSahabas();

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">{t("title")}</h1>

      <FilteredListCardItem
        variant="sahabas"
        items={sahabas}
      />
    </div>
  );
}

// Generate static metadata
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("sahabas");

  const title = `${t("title-metadata")} | Moslim`;
  const description = t("description-metadata");

  return {
    title,
    description,
  };
}
