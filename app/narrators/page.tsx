/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllNarrators } from "@/src/services/services";
import { FilteredListCard } from "@/src/ui/FilteredListCard/FilteredListCard";

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
