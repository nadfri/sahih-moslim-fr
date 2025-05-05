/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllSahabas } from "@/src/services/services";
import { ListPage } from "@/src/ui/ListLayoutPage";

export default async function SahabasPage() {
  const sahabas = await getAllSahabas();

  return (
    <ListPage
      title="Hadiths mentionnant des Compagnons"
      persons={sahabas}
      basePath="sahabas"
    />
  );
}
