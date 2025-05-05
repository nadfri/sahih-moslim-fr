/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllChapters,
  getChapterBySlug,
  getChapterWithHadiths,
} from "@/src/services/services";
import { BadgeNumberOfHadith } from "@/src/ui/BadgeNumberOfHadith/BadgeNumberOfHadith";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";

export type ParamsType = Promise<{ slug: string }>;

export default async function PageByChapters(props: { params: ParamsType }) {
  const params = await props.params;
  const slug = params.slug;

  const { chapter, hadiths } = await getChapterWithHadiths(slug);

  if (!chapter) {
    notFound();
  }

  return (
    <>
      <h1 className="title">{chapter.title}</h1>

      <BadgeNumberOfHadith
        count={hadiths.length}
        size="large"
      />

      <div className="space-y-8">
        {hadiths.map((hadith) => (
          <Hadith
            key={hadith.id}
            hadith={hadith}
          />
        ))}
      </div>
    </>
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
    title: `Chapitre: ${chapter.title}`,
    description: `Collection de hadiths du chapitre ${chapter.title} - Sahih Moslim`,
  };
}

/*Generate static paths for all chapters using slugified titles*/
export async function generateStaticParams() {
  const chapters = await getAllChapters();

  return chapters.map((chapter) => ({
    slug: chapter.slug,
  }));
}
