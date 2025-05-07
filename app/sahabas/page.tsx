/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllSahabas } from "@/src/services/services";
import { ListLayoutPage } from "@/src/ui/ListLayoutPage/ListLayoutPage";

export default async function SahabasPage() {
  const sahabas = await getAllSahabas();

  return (
    <ListLayoutPage
      title="Hadiths mentionnant des Compagnons"
      persons={sahabas}
      basePath="sahabas"
    />
  );
}
