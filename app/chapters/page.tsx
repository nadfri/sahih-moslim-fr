/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllChapters } from "@/src/services/services";
import { ChaptersFilter } from "./ChaptersFilter";

export default async function ChaptersPage() {
  const chapters = await getAllChapters();
  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">Chapitres de Sahih Muslim</h1>
      {/* Filter and grid */}
      <ChaptersFilter chapters={chapters} />
    </div>
  );
}
