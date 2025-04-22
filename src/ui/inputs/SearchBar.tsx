"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { SearchSelect } from "./SearchSelect";

// Props now only include initial values and data lists
type SearchBarProps = {
  initialFilterMode?: "word" | "narrator" | "sahaba";
  initialWord?: string;
  initialNarrator?: string;
  initialSahaba?: string;
  narrators: string[];
  sahabas: string[];
};

export function SearchBar({
  initialFilterMode = "word",
  initialWord = "",
  initialNarrator = "",
  initialSahaba = "",
  narrators,
  sahabas,
}: SearchBarProps) {
  // Internal state management
  const [filterMode, setFilterMode] = useState(initialFilterMode);
  const [word, setWord] = useState(initialWord);
  const [selectedNarrator, setSelectedNarrator] = useState(initialNarrator);
  const [selectedSahaba, setSelectedSahaba] = useState(initialSahaba);

  const router = useRouter();

  // Handle form submission internally
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("filterMode", filterMode);
    // Only add params if they have a value to keep URL clean
    if (filterMode === "word" && word) params.set("query", word);
    if (filterMode === "narrator" && selectedNarrator)
      params.set("narrator", selectedNarrator);
    if (filterMode === "sahaba" && selectedSahaba)
      params.set("sahaba", selectedSahaba);
    // Use push for navigation, updating the URL and triggering re-render of the server component
    router.push(`/search?${params.toString()}`);
  }

  // Function to handle radio change and reset other inputs
  const handleModeChange = (newMode: "word" | "narrator" | "sahaba") => {
    setFilterMode(newMode);
    // Reset other fields when mode changes
    if (newMode !== "word") setWord("");
    if (newMode !== "narrator") setSelectedNarrator("");
    if (newMode !== "sahaba") setSelectedSahaba("");
  };

  return (
    <form
      className="mb-6"
      method="GET"
      onSubmit={handleSubmit} // Use internal handler
      autoComplete="off"
    >
      {/* Filter mode radio */}
      <div className="flex gap-6 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="filterMode"
            value="word"
            checked={filterMode === "word"}
            onChange={() => handleModeChange("word")} // Use internal handler
            className="accent-emerald-600"
          />
          <span className="text-sm">Par mot</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="filterMode"
            value="narrator"
            checked={filterMode === "narrator"}
            onChange={() => handleModeChange("narrator")} // Use internal handler
            className="accent-emerald-600"
          />
          <span className="text-sm">Par Narrateur</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="filterMode"
            value="sahaba"
            checked={filterMode === "sahaba"}
            onChange={() => handleModeChange("sahaba")} // Use internal handler
            className="accent-emerald-600"
          />
          <span className="text-sm">Par Rapporteur</span>
        </label>
      </div>
      {/* Dynamic input depending on filter mode */}
      <div className="flex gap-2">
        {filterMode === "word" && (
          <input
            type="text"
            name="query"
            value={word} // Use internal state
            onChange={(e) => setWord(e.target.value)} // Use internal setter
            placeholder="Rechercher par mot, narrateur ou rapporteur..."
            className="flex-1 border border-emerald-500 rounded-l px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
            autoFocus
          />
        )}
        {filterMode === "narrator" && (
          <div className="flex-1">
            <SearchSelect
              id="narrator-select"
              label=""
              options={narrators}
              value={selectedNarrator} // Use internal state
              onChange={setSelectedNarrator} // Use internal setter
              placeholder="Choisir un narrateur"
              name="narrator"
            />
          </div>
        )}
        {filterMode === "sahaba" && (
          <div className="flex-1">
            <SearchSelect
              id="sahaba-select"
              label=""
              options={sahabas}
              value={selectedSahaba} // Use internal state
              onChange={setSelectedSahaba} // Use internal setter
              placeholder="Choisir un rapporteur"
              name="sahaba"
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 transition"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
