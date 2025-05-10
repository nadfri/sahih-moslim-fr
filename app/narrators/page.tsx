/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllNarrators } from "@/src/services/services";
import { FilteredList } from "@/src/ui/FilteredList/FilteredList";

export default async function NarratorsPage() {
  const narrators = await getAllNarrators();

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">Hadiths mentionnant des narrateurs</h1>

      <FilteredList
        items={narrators}
        variant="narrators"
      />
    </div>
  );
}
