/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllChapters } from "@/src/services/services";
import { FilteredListCard } from "@/src/ui/FilteredListCard/FilteredListCard";
import { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

export default async function ChaptersPage() {
  const chapters = await getAllChapters();

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">Chapitres de Sahih Muslim</h1>

      <FilteredListCard
        items={chapters}
        variant="chapters"
      />
    </div>
  );
}

// Generate static metadata
export async function generateMetadata(): Promise<Metadata> {
  const title = "Les Chapitres de Moslim";
  const description =
    "Découvrez les chapitres des hadiths dans la collection Sahih Moslim.";

  return {
    title,
    description,
  };
}
