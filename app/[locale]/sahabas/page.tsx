/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllSahabas } from "@/src/services/services";
import { FilteredListCard } from "@/src/ui/FilteredListCard/FilteredListCard";
import { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

export default async function SahabasPage() {
  const sahabas = await getAllSahabas();

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">Hadiths mentionnant des compagnons</h1>

      <FilteredListCard
        variant="sahabas"
        items={sahabas}
      />
    </div>
  );
}

// Generate static metadata
export async function generateMetadata(): Promise<Metadata> {
  const title = "Les Sahabas dans Moslim";
  const description =
    "Découvrez les Sahabas dans les hadiths de la collection Sahih Moslim.";

  return {
    title,
    description,
  };
}
