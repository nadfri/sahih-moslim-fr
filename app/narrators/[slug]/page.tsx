/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllNarrators,
  getNarratorBySlug,
  getNarratorWithHadiths,
} from "@/src/services/services";
import { ListLayoutHadith } from "@/src/ui/hadith/ListLayoutHadith";

export type ParamsType = Promise<{ slug: string }>;

export default async function PageByNarrators(props: { params: ParamsType }) {
  const params = await props.params;
  const slug = params.slug;

  const { narrator, hadiths } = await getNarratorWithHadiths(slug);

  if (!narrator) {
    return notFound();
  }

  return (
    <ListLayoutHadith
      title="Hadiths mentionnant"
      name={narrator.name}
      hadiths={hadiths}
    />
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

  return narrators.map((narrator) => ({ slug: narrator.slug }));
}
