/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllNarrators } from "@/src/services/services";
import { PersonFilter } from "@/src/ui/PersonsFilter/PersonsFilter";

export default async function NarratorsPage() {
  const narrators = await getAllNarrators();

  return (
    <>
      <h1 className="title">Hadiths mentionnant des narrateurs</h1>

      <PersonFilter
        persons={narrators}
        type="narrators"
      />
    </>
  );
}
