/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { Metadata } from "next";
import { SearchContainer } from "./components/SearchContainer";
import { getSahabaNames, getTransmitterNames } from "@/src/services/services";
import { ParamsLocale } from "@/src/types/types";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

export default async function SearchPage({ params }: { params: ParamsLocale }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("search");

  const [sahabaNames, transmitterNames] = await Promise.all([
    getSahabaNames(),
    getTransmitterNames(),
  ]);

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">{t("title")}</h1>

      <SearchContainer
        sahabas={sahabaNames}
        transmitters={transmitterNames}
      />
    </div>
  );
}

// Generate static metadata
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("search");

  const title = `${t("title-metadata")} | Moslim`;
  const description = t("description-metadata");

  return {
    title,
    description,
  };
}
