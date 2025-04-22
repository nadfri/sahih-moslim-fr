"use client";

// SearchBar component for advanced hadith search
import { SearchSelect } from "./SearchSelect";

type SearchBarProps = {
  filterMode: "word" | "narrator" | "sahaba";
  setFilterMode: (mode: "word" | "narrator" | "sahaba") => void;
  word: string;
  setWord: (v: string) => void;
  narrators: string[];
  selectedNarrator: string;
  setSelectedNarrator: (v: string) => void;
  sahabas: string[];
  selectedSahaba: string;
  setSelectedSahaba: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function SearchBar({
  filterMode,
  setFilterMode,
  word,
  setWord,
  narrators,
  selectedNarrator,
  setSelectedNarrator,
  sahabas,
  selectedSahaba,
  setSelectedSahaba,
  onSubmit,
}: SearchBarProps) {
  return (
    <form
      className="mb-6"
      method="GET"
      onSubmit={onSubmit}
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
            onChange={() => {
              setFilterMode("word");
              setSelectedNarrator("");
              setSelectedSahaba("");
            }}
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
            onChange={() => {
              setFilterMode("narrator");
              setWord("");
              setSelectedSahaba("");
            }}
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
            onChange={() => {
              setFilterMode("sahaba");
              setWord("");
              setSelectedNarrator("");
            }}
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
            value={word}
            onChange={(e) => setWord(e.target.value)}
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
              value={selectedNarrator}
              onChange={setSelectedNarrator}
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
              value={selectedSahaba}
              onChange={setSelectedSahaba}
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
