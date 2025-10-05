/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllTransmitters,
  getTransmitterBySlug,
  getTransmitterWithHadiths,
} from "@/src/services/services";
import { ListLayoutHadith } from "@/src/ui/hadith/ListLayoutHadith/ListLayoutHadith";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ParamsSlug } from "@/src/types/types";

export default async function PageByTransmitter({
  params,
}: {
  params: ParamsSlug;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("transmitters");

  const { transmitter, hadiths } = await getTransmitterWithHadiths(slug);

  if (!transmitter) {
    return notFound();
  }

  return (
    <ListLayoutHadith
      title={t("title-slug")}
      name={transmitter.name_fr}
      hadiths={hadiths}
    />
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata(props: {
  params: ParamsSlug;
}): Promise<Metadata> {
  const params = await props.params;

  const slug = params.slug;

  const transmitter = await getTransmitterBySlug(slug);

  const t = await getTranslations("transmitters");

  if (!transmitter) {
    return {
      title: t("notFound"),
      description: t("notFoundDescription"),
    };
  }

  return {
    title: t("title-metadata", { name: transmitter.name_fr }),
    description: t("description-metadata-slug", { name: transmitter.name_fr }),
  };
}

/*Generate static paths for all hadiths*/
export async function generateStaticParams() {
  const transmitters = await getAllTransmitters();

  return transmitters.map((transmitter) => ({
    slug: transmitter.slug,
  }));
}
