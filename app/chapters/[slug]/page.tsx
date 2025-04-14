/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllChapters,
  getChapterBySlug,
  getHadithByChapterSlug,
} from "@/src/services/services";
import { slugify } from "@/src/utils/slugify";
import { Hadith } from "../../../src/ui/hadith/Hadith";

export type ParamsType = Promise<{ slug: string }>;

export default async function PageByChapters(props: { params: ParamsType }) {
  const params = await props.params;
  const slug = params.slug;

  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    return notFound();
  }

  const hadiths = getHadithByChapterSlug(slug);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Chapitre: {chapter.title}</h1>
      <h2 className="text-xl mb-4">
        De {chapter.range[0]} à {chapter.range[1]}
      </h2>
      <p className="text-lg mb-4">Nombre de hadiths: {hadiths.length}</p>

      <div className="space-y-8">
        {hadiths.map((hadith) => (
          <Hadith
            key={hadith.id}
            hadith={hadith}
          />
        ))}
      </div>
    </div>
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata(props: {
  params: ParamsType;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    return {
      title: "Chapitre non trouvé",
    };
  }

  return {
    title: `Chapitre: ${chapter.title}`,
    description: `Collection de hadiths du chapitre ${chapter.title} - Sahih Moslim`,
  };
}

/*Generate static paths for all hadiths*/
export async function generateStaticParams() {
  const chapters = getAllChapters();

  return chapters.map((chapter: { title: string }) => ({
    slug: slugify(chapter.title),
  }));
}
