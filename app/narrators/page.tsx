/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllNarrators } from "@/src/services/services";
import { FilteredListCard } from "@/src/ui/FilteredListCard/FilteredListCard";
import { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

export default async function NarratorsPage() {
  const narrators = await getAllNarrators();

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">Hadiths mentionnant des narrateurs</h1>

      <FilteredListCard
        items={narrators}
        variant="narrators"
      />
    </div>
  );
}

// Generate static metadata
export async function generateMetadata(): Promise<Metadata> {
  const title = "Les Narrateurs dans Moslim";
  const description =
    "Découvrez les narrateurs des hadiths dans la collection Sahih Moslim.";

  return {
    title,
    description,
  };
}
