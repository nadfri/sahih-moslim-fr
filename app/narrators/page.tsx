/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllNarrators } from "@/src/services/services";
import { ListLayoutPage } from "@/src/ui/ListLayoutPage/ListLayoutPage";

export default async function NarratorsPage() {
  const narrators = await getAllNarrators();

  return (
    <ListLayoutPage
      title="Narrateurs des Hadiths"
      persons={narrators}
      basePath="narrators"
    />
  );
}
