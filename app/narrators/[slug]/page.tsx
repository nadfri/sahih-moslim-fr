/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllNarrators,
  getNarratorBySlug,
  getNarratorWithHadiths,
} from "@/src/services/services";
import { BadgeNumberOfHadith } from "@/src/ui/BadgeNumberOfHadith";
import { slugify } from "@/src/utils/slugify";
import { Hadith } from "@/ui/hadith/Hadith";

export type ParamsType = Promise<{ slug: string }>;

export default async function PageByNarrators(props: { params: ParamsType }) {
  const params = await props.params;
  const slug = params.slug;

  const { narrator, hadiths } = await getNarratorWithHadiths(slug);

  if (!narrator) {
    return notFound();
  }

  return (
    <>
      <h1 className="text-2xl md:text-4xl font-serif font-bold text-center text-emerald-800 mb-8 md:mb-12 tracking-tight">
        Hadiths mentionnant{" "}
        <span className="text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
          {narrator.name}
        </span>
      </h1>

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

/*Generate metadata for each narrator*/
export async function generateMetadata(props: {
  params: ParamsType;
}): Promise<Metadata> {
  const params = await props.params;

  const slug = params.slug;

  const narrator = await getNarratorBySlug(slug);

  if (!narrator) {
    return {
      title: "Narrateur non trouvé",
    };
  }

  return {
    title: `Narrateur: ${narrator.name}`,
    description: `Collection de hadiths rapportés par ${narrator.name} - Sahih Moslim`,
  };
}

/*Generate static paths for all narrators*/
export async function generateStaticParams() {
  const narrators = await getAllNarrators();

  return narrators.map((narrator) => ({ slug: slugify(narrator.name) }));
}
