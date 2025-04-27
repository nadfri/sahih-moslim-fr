"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { FilterType, HadithType } from "@/src/types/types";
import { BadgeNumberOfHadith } from "@/src/ui/BadgeNumberOfHadith";
import { Hadith } from "@/src/ui/hadith/Hadith";
import { MultiSelect } from "../../src/ui/inputs/MultiSelect";
import { SearchSelect } from "../../src/ui/inputs/SearchSelect";

function extractInitials(sp: URLSearchParams) {
  const filterMode = (sp.get("filterMode") as FilterType) || "word";
  const queryParam = sp.get("query");
  const queryParams = sp.getAll("query");

  let query = "";
  let narrator = "";
  let sahabas: string[] = [];

  if (filterMode === "word") {
    query = queryParam?.trim() || "";
  } else if (filterMode === "narrator") {
    // Primarily read from 'query'
    narrator = queryParam || "";
    // Backward compatibility: if 'query' is empty but 'narrator' exists
    if (!narrator && sp.has("narrator")) {
      narrator = sp.get("narrator") || "";
    }
  } else if (filterMode === "sahaba") {
    // Primarily read from 'query' (potentially multiple values)
    sahabas = queryParams.filter(Boolean);
    // Backward compatibility: if 'query' is empty but 'sahaba' exists
    if (sahabas.length === 0 && sp.has("sahaba")) {
      sahabas = sp.getAll("sahaba");
    }
  }

  return { filterMode, query, narrator, sahabas };
}

// Filter hadiths based on filter mode and values
function filterHadiths(
  hadiths: HadithType[],
  {
    filterMode,
    query,
    narrator,
    sahabas,
  }: {
    filterMode: FilterType;
    query: string;
    narrator: string;
    sahabas: string[];
  }
) {
  if (filterMode === "narrator" && narrator) {
    return hadiths.filter((h) => h.narrator.name === narrator);
  }
  if (filterMode === "sahaba" && sahabas.length > 0) {
    return hadiths.filter(
      (h) =>
        Array.isArray(h.mentionedSahabas) &&
        h.mentionedSahabas.some((s) => sahabas.includes(s.name))
    );
  }
  if (filterMode === "word" && query.length >= 3) {
    const q = query.toLowerCase();
    return hadiths.filter((h) => {
      const inMatnFr = h.matn_fr.toLowerCase().includes(q);
      const inMatnAr = h.matn_ar.toLowerCase().includes(q);

      return inMatnFr || inMatnAr;
    });
  }
  return [];
}

export function SearchBar({
  hadiths,
  narrators,
  sahabas,
}: {
  hadiths: HadithType[];
  narrators: string[];
  sahabas: string[];
}) {
  const searchParams = useSearchParams();

  const initialValues = extractInitials(searchParams);

  const [filterMode, setFilterMode] = useState<FilterType>(
    initialValues.filterMode
  );
  const [query, setQuery] = useState(initialValues.query);
  const [narrator, setNarrator] = useState(initialValues.narrator);
  const [selectedSahabas, setSelectedSahabas] = useState<string[]>(
    initialValues.sahabas
  );

  const [results, setResults] = useState<HadithType[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Function to handle filter mode change and reset fields
  const handleFilterModeChange = (newMode: FilterType) => {
    setFilterMode(newMode);
    setQuery("");
    setNarrator("");
    setSelectedSahabas([]);
  };

  // Automatically search if there are criteria in the URL (for URL sharing)
  useEffect(() => {
    // Only trigger if there are search params in the URL
    const hasCriteria =
      (filterMode === "word" && query) ||
      (filterMode === "narrator" && narrator) ||
      (filterMode === "sahaba" && selectedSahabas.length > 0);

    if (hasCriteria) {
      setResults(
        filterHadiths(hadiths, {
          filterMode,
          query,
          narrator,
          sahabas: selectedSahabas,
        })
      );
      setHasSearched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <form
        className="mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          setHasSearched(true);

          const params = new URLSearchParams();
          params.set("filterMode", filterMode);

          if (filterMode === "word" && query) {
            params.set("query", query);
          } else if (filterMode === "narrator" && narrator) {
            params.set("query", narrator); // Use 'query' param for narrator value
          } else if (filterMode === "sahaba" && selectedSahabas.length > 0) {
            selectedSahabas.forEach(
              (sahaba) => params.append("query", sahaba) // Use 'query' param for sahaba values
            );
          }

          // Update URL using pushState to avoid navigation
          const newUrl = `/search?${params.toString()}`;
          window.history.pushState(null, "", newUrl);

          // Filter hadiths using the actual state values, not derived ones
          setResults(
            filterHadiths(hadiths, {
              filterMode,
              query: query, // Pass the actual query state for 'word' mode filtering
              narrator: narrator, // Pass the actual narrator state for 'narrator' mode filtering
              sahabas: selectedSahabas, // Pass the actual sahabas state for 'sahaba' mode filtering
            })
          );
        }}
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
              onChange={() => handleFilterModeChange("word")}
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
              onChange={() => handleFilterModeChange("narrator")}
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
              onChange={() => handleFilterModeChange("sahaba")}
              className="sr-only"
            />
            <span>Par Compagnons</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-2 sm:items-start gap-2 sm:gap-0">
          <div className="flex-1 w-full">
            {filterMode === "word" && (
              <input
                type="text"
                name="queryInput"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par mot (3 lettres min)..." // Updated placeholder
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
                autoFocus
              />
            )}
            {filterMode === "narrator" && (
              <SearchSelect
                id="narrator-select"
                label=""
                options={narrators}
                value={narrator}
                onChange={setNarrator}
                placeholder="Choisir un narrateur"
                name="narratorInput"
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
                name="sahabaInput"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Rechercher
          </button>
        </div>
      </form>

      <div className="space-y-8 mt-8">
        {hasSearched ? (
          <>
            <BadgeNumberOfHadith
              count={results.length}
              size="large"
            />
            {filterMode === "word" && query && query.length < 3 && (
              <div className="text-gray-500 italic">
                Merci de saisir au moins 3 lettres pour la recherche par mot.
              </div>
            )}
            {results.map((hadith) => (
              <Hadith
                key={hadith.id}
                hadith={hadith}
                highlight={filterMode === "word" ? query : undefined}
              />
            ))}
            {results.length === 0 &&
              (query || narrator || selectedSahabas.length > 0) &&
              !(filterMode === "word" && query && query.length < 3) && (
                <div className="text-gray-500 italic">
                  Aucun hadith ne correspond à votre recherche.
                </div>
              )}
          </>
        ) : (
          <div className="text-gray-400 italic">
            Veuillez saisir vos critères et cliquer sur "Rechercher".
          </div>
        )}
      </div>
    </div>
  );
}
