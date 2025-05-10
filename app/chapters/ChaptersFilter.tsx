"use client";

import { useMemo, useState } from "react";

import { ChapterType } from "@/src/types/types";
import { SearchSelect } from "@/src/ui/inputs/SearchSelect/SearchSelect";
import { ChapterCard } from "./ChapterCard";

export function ChaptersFilter({ chapters }: { chapters: ChapterType[] }) {
  // State for search/filter
  const [selected, setSelected] = useState("");

  // Filtered chapters based on selected value
  const filtered = useMemo(() => {
    if (!selected) return chapters;
    return chapters.filter((c) => c.title === selected);
  }, [chapters, selected]);

  // Extract chapter titles for SearchSelect options
  const options = useMemo(
    () => chapters.map((chapter) => chapter.title),
    [chapters]
  );

  return (
    <>
      <div className="mb-10">
        <SearchSelect
          id="chapter-search"
          label=""
          options={options}
          value={selected}
          onChange={setSelected}
          placeholder="Rechercher un chapitre..."
        />
      </div>
      {/* Grid of filtered chapters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filtered.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
          />
        ))}
      </div>
    </>
  );
}
