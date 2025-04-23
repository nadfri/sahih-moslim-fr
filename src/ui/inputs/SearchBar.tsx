"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { MultiSelect } from "./MultiSelect";
import { SearchSelect } from "./SearchSelect";

type SearchBarProps = {
  initialFilterMode?: "word" | "narrator" | "sahaba";
  initialWord?: string;
  initialNarrator?: string;
  initialSahabas?: string[];
  narrators: string[];
  sahabas: string[];
};

export function SearchBar({
  initialFilterMode = "word",
  initialWord = "",
  initialNarrator = "",
  initialSahabas = [],
  narrators,
  sahabas,
}: SearchBarProps) {
  const [filterMode, setFilterMode] = useState(initialFilterMode);
  const [word, setWord] = useState(initialWord);
  const [selectedNarrator, setSelectedNarrator] = useState(initialNarrator);
  const [selectedSahabas, setSelectedSahabas] = useState(initialSahabas);

  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("filterMode", filterMode);
    if (filterMode === "word" && word) params.set("query", word);
    if (filterMode === "narrator" && selectedNarrator)
      params.set("narrator", selectedNarrator);
    if (filterMode === "sahaba" && selectedSahabas.length > 0) {
      selectedSahabas.forEach((sahaba) => params.append("sahaba", sahaba));
    }
    router.push(`/search?${params.toString()}`);
  }

  const handleModeChange = (newMode: "word" | "narrator" | "sahaba") => {
    setFilterMode(newMode);
    if (newMode !== "word") setWord("");
    if (newMode !== "narrator") setSelectedNarrator("");
    if (newMode !== "sahaba") setSelectedSahabas([]);
  };

  return (
    <form
      className="mb-6"
      method="GET"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="grid grid-cols-3 gap-2 mb-4">
        <label
          className={`flex items-center justify-center gap-2 cursor-pointer p-2 rounded-md border text-center text-sm transition ${
            filterMode === "word"
              ? "bg-emerald-100 border-emerald-300 text-emerald-600 font-medium"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="filterMode"
            value="word"
            checked={filterMode === "word"}
            onChange={() => handleModeChange("word")}
            className="sr-only"
          />
          <span>Par mot</span>
        </label>
        <label
          className={`flex items-center justify-center gap-2 cursor-pointer p-2 rounded-md border text-center text-sm transition ${
            filterMode === "narrator"
              ? "bg-emerald-100 border-emerald-300 text-emerald-600 font-medium"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="filterMode"
            value="narrator"
            checked={filterMode === "narrator"}
            onChange={() => handleModeChange("narrator")}
            className="sr-only"
          />
          <span>Par Narrateur</span>
        </label>
        <label
          className={`flex items-center justify-center gap-2 cursor-pointer p-2 rounded-md border text-center text-sm transition ${
            filterMode === "sahaba"
              ? "bg-emerald-100 border-emerald-300 text-emerald-600 font-medium"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="filterMode"
            value="sahaba"
            checked={filterMode === "sahaba"}
            onChange={() => handleModeChange("sahaba")}
            className="sr-only"
          />
          <span>Par Compagnons</span>
        </label>
      </div>

      {/* Input/Select and Button container - Stack vertically on small screens */}
      <div className="flex flex-col sm:flex-row sm:space-x-2 sm:items-start gap-2 sm:gap-0">
        <div className="flex-1 w-full">
          {filterMode === "word" && (
            <input
              type="text"
              name="query"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Rechercher par mot..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
              autoFocus
            />
          )}
          {filterMode === "narrator" && (
            <SearchSelect
              id="narrator-select"
              label=""
              options={narrators}
              value={selectedNarrator}
              onChange={setSelectedNarrator}
              placeholder="Choisir un narrateur"
              name="narrator"
            />
          )}
          {filterMode === "sahaba" && (
            <MultiSelect
              id="sahaba-multiselect"
              label=""
              options={sahabas}
              selected={selectedSahabas}
              onChange={setSelectedSahabas}
              placeholder="Choisir un ou plusieurs rapporteurs"
              name="sahaba"
            />
          )}
        </div>

        {/* Button takes full width when stacked, auto width otherwise */}
        <button
          type="submit"
          className="w-full sm:w-auto p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
