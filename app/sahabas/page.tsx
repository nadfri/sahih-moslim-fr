/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllSahabas } from "@/src/services/services";
import { PersonFilter } from "@/src/ui/PersonsFilter/PersonsFilter";

export default async function SahabasPage() {
  const sahabas = await getAllSahabas();

  return (
    <>
      <h1 className="title">Hadiths mentionnant des compagnons</h1>

      <PersonFilter
        type="sahabas"
        persons={sahabas}
      />
    </>
  );
}
