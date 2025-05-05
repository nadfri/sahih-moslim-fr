/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllNarrators } from "@/src/services/services";
import { ListPage } from "@/src/ui/ListLayoutPage/ListLayoutPage";

export default async function NarratorsPage() {
  const narrators = await getAllNarrators();

  return (
    <ListPage
      title="Narrateurs des Hadiths"
      persons={narrators}
      basePath="narrators"
    />
  );
}
