/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllChapters,
  getChapterBySlug,
  getChapterWithHadiths,
} from "@/src/services/services";
import { ListLayoutHadith } from "@/src/ui/hadith/ListLayoutHadith/ListLayoutHadith";

export type ParamsType = Promise<{ slug: string }>;

export default async function PageByChapters(props: { params: ParamsType }) {
  const params = await props.params;
  const slug = params.slug;

  const { chapter, hadiths } = await getChapterWithHadiths(slug);

  if (!chapter) {
    notFound();
  }

  return (
    <ListLayoutHadith
      title="Hadiths du Chapitre"
      name={chapter.name_fr}
      hadiths={hadiths}
    />
  );
}

/*Generate metadata for each chapter*/
export async function generateMetadata(props: {
  params: ParamsType;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  // For metadata we can keep using the separate function
  const chapter = await getChapterBySlug(slug);

  if (!chapter) {
    return {
      title: "Chapitre non trouvé",
      description: "Ce chapitre n'existe pas.",
    };
  }

  return {
    title: `Chapitre: ${chapter.name_fr}`,
    description: `Collection de hadiths du chapitre ${chapter.name_fr} - Sahih Moslim`,
  };
}

/*Generate static paths for all chapters using slugified names*/
export async function generateStaticParams() {
  const chapters = await getAllChapters();

  return chapters.map((chapter) => ({
    slug: chapter.slug,
  }));
}
