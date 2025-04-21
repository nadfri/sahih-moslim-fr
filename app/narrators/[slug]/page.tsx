/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllNarrators,
  getHadithByNarratorSlug,
  getNarratorBySlug,
} from "@/src/services/services";
import { slugify } from "@/src/utils/slugify";
import { Hadith } from "@/ui/hadith/Hadith";

export type ParamsType = Promise<{ slug: string }>;

export default async function PageByNarrators(props: { params: ParamsType }) {
  const params = await props.params;
  const slug = params.slug;

  const narrator = getNarratorBySlug(slug);

  if (!narrator) {
    return notFound();
  }

  const hadiths = getHadithByNarratorSlug(slug);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-emerald-800 mb-12 md:mb-16 tracking-tight">
        Hadiths rapporté par {narrator}
      </h1>

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

/*Generate metadata for each narrator*/
export async function generateMetadata(props: {
  params: ParamsType;
}): Promise<Metadata> {
  const params = await props.params;

  const slug = params.slug;

  const narrator = getNarratorBySlug(slug);

  if (!narrator) {
    return {
      title: "Narrateur non trouvé",
    };
  }

  return {
    title: `Narrateur: ${narrator}`,
    description: `Collection de hadiths rapportés par ${narrator} - Sahih Moslim`,
  };
}

/*Generate static paths for all narrators*/
export async function generateStaticParams() {
  const narrators = getAllNarrators();

  return narrators.map((narrator) => ({ slug: slugify(narrator) }));
}
