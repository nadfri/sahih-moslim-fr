/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllChapters } from "@/src/services/services";
import { ChapterCard } from "./ChapterCard";

export default async function ChaptersPage() {
  const chapters = await getAllChapters();
  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">Chapitres de Sahih Muslim</h1>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {chapters.map((chapter, index) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
