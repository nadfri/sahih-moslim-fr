/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllNarrators } from "@/src/services/services";
import { ListLayoutPerson } from "@/src/ui/ListLayoutPerson/ListLayoutPerson";

export default async function NarratorsPage() {
  const narrators = await getAllNarrators();

  return (
    <ListLayoutPerson
      title="Narrateurs des Hadiths"
      persons={narrators}
      basePath="narrators"
    />
  );
}
