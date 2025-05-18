/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllSahabas } from "@/src/services/services";
import { FilteredListCard } from "@/src/ui/FilteredListCard/FilteredListCard";

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
