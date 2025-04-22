"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getAllHadiths } from "@/src/services/services";
import { HadithType } from "@/src/types/types";
import { Hadith } from "@/src/ui/hadith/Hadith";
import { SearchBar } from "@/src/ui/inputs/SearchBar";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function getUnique(hadiths: HadithType[]) {
  const narrators = Array.from(
    new Set(hadiths.map((h) => h.narrator).filter(Boolean))
  );
  const sahabas = Array.from(new Set(hadiths.flatMap((h) => h.sahabas || [])));
  return { narrators, sahabas };
}

export default function SearchPage(props: { searchParams: SearchParams }) {
  const searchParams = use(props.searchParams);
  const initialQuery =
    typeof searchParams.query === "string" ? searchParams.query.trim() : "";

  const hadiths = getAllHadiths();
  const { narrators, sahabas } = getUnique(hadiths);

  // Filter mode: "narrator", "sahaba", "word"
  const [filterMode, setFilterMode] = useState<"narrator" | "sahaba" | "word">(
    "word"
  );
  const [selectedNarrator, setSelectedNarrator] = useState("");
  const [selectedSahaba, setSelectedSahaba] = useState("");
  const [word, setWord] = useState(initialQuery);

  const router = useRouter();
  const urlSearchParams = useSearchParams();

  // Handle form submit: update URL with search params for sharing
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("filterMode", filterMode);
    if (filterMode === "word" && word) params.set("query", word);
    if (filterMode === "narrator" && selectedNarrator)
      params.set("narrator", selectedNarrator);
    if (filterMode === "sahaba" && selectedSahaba)
      params.set("sahaba", selectedSahaba);
    router.push(`/search?${params.toString()}`);
  }

  // Hydrate state from URL params on mount (for shareable links)
  useEffect(() => {
    const mode = urlSearchParams.get("filterMode") as
      | "word"
      | "narrator"
      | "sahaba"
      | null;
    if (mode && mode !== filterMode) setFilterMode(mode);
    if (mode === "word") setWord(urlSearchParams.get("query") || "");
    if (mode === "narrator")
      setSelectedNarrator(urlSearchParams.get("narrator") || "");
    if (mode === "sahaba")
      setSelectedSahaba(urlSearchParams.get("sahaba") || "");
  }, []);

  // Filtering logic
  let filtered: HadithType[] = [];
  if (filterMode === "narrator" && selectedNarrator) {
    filtered = hadiths.filter((h) => h.narrator === selectedNarrator);
  } else if (filterMode === "sahaba" && selectedSahaba) {
    filtered = hadiths.filter(
      (h) => Array.isArray(h.sahabas) && h.sahabas.includes(selectedSahaba)
    );
  } else if (filterMode === "word" && word && word.length >= 3) {
    const q = word.toLowerCase();
    filtered = hadiths.filter(
      (h) =>
        h.matn.toLowerCase().includes(q) ||
        (h.narrator && h.narrator.toLowerCase().includes(q)) ||
        (Array.isArray(h.sahabas) &&
          h.sahabas.some((s) => s.toLowerCase().includes(q)))
    );
  } else if (filterMode === "word" && (!word || word.length < 3)) {
    // Do not filter, do not show results
    filtered = [];
  } else {
    filtered = hadiths;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Advanced search bar */}
      <SearchBar
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        word={word}
        setWord={setWord}
        narrators={narrators}
        selectedNarrator={selectedNarrator}
        setSelectedNarrator={setSelectedNarrator}
        sahabas={sahabas}
        selectedSahaba={selectedSahaba}
        setSelectedSahaba={setSelectedSahaba}
        onSubmit={handleSubmit}
      />
      {/* Display filtered hadiths */}
      <div className="space-y-8">
        {filterMode === "word" && word && word.length < 3 && (
          <div className="text-gray-500 italic">
            Merci de saisir au moins 3 lettres pour la recherche par mot.
          </div>
        )}
        {filtered.map((hadith) => (
          <Hadith
            key={hadith.id}
            hadith={hadith}
          />
        ))}
      </div>
    </div>
  );
}
