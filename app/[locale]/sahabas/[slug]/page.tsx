/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllSahabas,
  getSahabaBySlug,
  getSahabaWithHadiths,
} from "@/src/services/services";
import { ListLayoutHadith } from "@/src/ui/hadith/ListLayoutHadith/ListLayoutHadith";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ParamsType } from "@/src/types/types";

export default async function PageBySahabas({
  params,
}: {
  params: ParamsType;
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
      name={sahaba.name_fr}
      hadiths={hadiths}
    />
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata(props: {
  params: ParamsType;
}): Promise<Metadata> {
  const params = await props.params;

  const slug = params.slug;

  const sahaba = await getSahabaBySlug(slug);

  const t = await getTranslations("sahabas");

  if (!sahaba) {
    return {
      title: t("notFound"),
      description: t("notFoundDescription"),
    };
  }

  return {
    title: t("title-slug", { name: sahaba.name_fr }),
    description: t("description-metadata-slug", { name: sahaba.name_fr }),
  };
}

/*Generate static paths for all hadiths*/
export async function generateStaticParams() {
  const sahabas = await getAllSahabas();

  return sahabas.map((sahaba) => ({
    slug: sahaba.slug,
  }));
}
