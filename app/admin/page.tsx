/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllChapters } from "@/src/services/services";
import { FilteredCardsEdit } from "@/src/ui/FilteredCardsEdit/FilteredCardsEdit";
import { AddItemForm } from "@/src/ui/forms/AddItemForm";

export default async function AdminPage() {
  const chapters = await getAllChapters();

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">Administration</h1>

      <AddItemForm
        initialItems={chapters}
        variant="chapters"
      />

      <br/>

      <AddItemForm
        initialItems={chapters}
        variant="narrators"
      />

      <FilteredCardsEdit
        items={chapters}
        variant="chapters"
      />
    </div>
  );
}
