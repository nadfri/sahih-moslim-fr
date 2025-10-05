/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllChapters,
  getChapterBySlug,
  getChapterWithHadiths,
} from "@/src/services/services";
import { ListLayoutHadith } from "@/src/ui/hadith/ListLayoutHadith/ListLayoutHadith";
import { ParamsSlug } from "@/src/types/types";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function PageByChapters({
  params,
}: {
  params: ParamsSlug;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("chapters");

  const { chapter, hadiths } = await getChapterWithHadiths(slug);

  if (!chapter) {
    notFound();
  }

  return (
    <ListLayoutHadith
      title={t("title-slug")}
      name={chapter.name_fr}
      hadiths={hadiths}
    />
  );
}

/*Generate metadata for each chapter*/
export async function generateMetadata(props: {
  params: ParamsSlug;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  // For metadata we can keep using the separate function
  const chapter = await getChapterBySlug(slug);

  const t = await getTranslations("chapters");

  if (!chapter) {
    return {
      title: t("notFound"),
      description: t("notFoundDescription"),
    };
  }

  return {
    title: t("title-metadata-slug", { name: chapter.name_fr }),
    description: t("description-metadata-slug", { name: chapter.name_fr }),
  };
}

/*Generate static paths for all chapters using slugified names*/
export async function generateStaticParams() {
  const chapters = await getAllChapters();

  return chapters.map((chapter) => ({
    slug: chapter.slug,
  }));
}
