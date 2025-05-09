/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllSahabas } from "@/src/services/services";
import { ListLayoutPerson } from "@/src/ui/ListLayoutPerson/ListLayoutPerson";

export default async function SahabasPage() {
  const sahabas = await getAllSahabas();

  return (
    <ListLayoutPerson
      title="Hadiths mentionnant des Compagnons"
      persons={sahabas}
      basePath="sahabas"
    />
  );
}
