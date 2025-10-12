/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { notFound } from "next/navigation";

import {
  getAllSahabas,
  getSahabaBySlug,
  getSahabaWithHadiths,
} from "@/src/services/services";
import { ListLayoutHadith } from "@/src/ui/hadith/ListLayoutHadith/ListLayoutHadith";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ParamsSlug } from "@/src/types/types";
import { getLocalizedName } from "@/src/utils/getLocalizedName";

export default async function PageBySahabas({
  params,
}: {
  params: ParamsSlug;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("sahabas");

  const { sahaba, hadiths } = await getSahabaWithHadiths(slug);

  if (!sahaba) {
    return notFound();
  }

  return (
    <ListLayoutHadith
      title={t("title-slug")}
      name={getLocalizedName(sahaba, locale)}
      hadiths={hadiths}
    />
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata({ params }: { params: ParamsSlug }) {
  const { slug, locale } = await params;

  const sahaba = await getSahabaBySlug(slug);

  const t = await getTranslations("sahabas");

  if (!sahaba) {
    return {
      title: t("notFound"),
      description: t("notFoundDescription"),
    };
  }

  return {
    title:
      t("title-metadata-slug", {
        name: getLocalizedName(sahaba, locale),
      }) + " | Moslim",
    description: t("description-metadata-slug", {
      name: getLocalizedName(sahaba, locale),
    }),
  };
}

/*Generate static paths for all hadiths*/
export async function generateStaticParams() {
  const sahabas = await getAllSahabas();

  return sahabas.map((sahaba) => ({
    slug: sahaba.slug,
  }));
}
