/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllChapters,
  getChapterBySlug,
  getHadithByChapterSlug,
} from "@/src/services/services";
import { Hadith } from "@/src/ui/hadith/Hadith";
import { slugify } from "@/src/utils/slugify";

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
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-center text-emerald-800 mb-8 md:mb-12 tracking-tight">
        {chapter}
      </h1>

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
    title: `Chapitre: ${chapter}`,
    description: `Collection de hadiths du chapitre ${chapter} - Sahih Moslim`,
  };
}

/*Generate static paths for all hadiths*/
export async function generateStaticParams() {
  const chapters = getAllChapters();

  return chapters.map((chapter) => ({
    slug: slugify(chapter),
  }));
}
