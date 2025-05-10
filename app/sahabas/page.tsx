/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllSahabas } from "@/src/services/services";
import { FilteredList } from "@/src/ui/FilteredList/FilteredList";

export default async function SahabasPage() {
  const sahabas = await getAllSahabas();

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">Hadiths mentionnant des compagnons</h1>

      <FilteredList
        variant="sahabas"
        items={sahabas}
      />
    </div>
  );
}
