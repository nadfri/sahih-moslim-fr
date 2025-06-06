/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { FilterType, HadithType } from "@/src/types/types";
import { BadgeNumberOfHadith } from "@/src/ui/hadith/BadgeNumberOfHadith/BadgeNumberOfHadith";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { MultiSelect } from "@/src/ui/inputs/MultiSelect/MultiSelect";
import { SearchSelect } from "@/src/ui/inputs/SearchSelect/SearchSelect";

function extractInitials(sp: URLSearchParams) {
  const filterMode = (sp.get("filterMode") as FilterType) || "word";
  const queryParam = sp.get("query");
  const queryParams = sp.getAll("query");

  let query = "";
  let narrator = "";
  let sahabas: string[] = [];

  switch (filterMode) {
    case "word":
      query = queryParam?.trim() || "";
      break;
    case "narrator":
      // Primarily read from 'query'
      narrator = queryParam || "";
      // Backward compatibility: if 'query' is empty but 'narrator' exists
      if (!narrator && sp.has("narrator")) {
        narrator = sp.get("narrator") || "";
      }
      break;
    case "sahaba":
      // Primarily read from 'query' (potentially multiple values)
      sahabas = queryParams.filter(Boolean);
      // Backward compatibility: if 'query' is empty but 'sahaba' exists
      if (sahabas.length === 0 && sp.has("sahaba")) {
        sahabas = sp.getAll("sahaba");
      }
      break;
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
  switch (filterMode) {
    case "narrator":
      if (narrator) {
        return hadiths.filter((h) => h.narrator.name === narrator);
      }
      break;
    case "sahaba":
      if (sahabas.length > 0) {
        return hadiths.filter((h) => {
          if (!Array.isArray(h.mentionedSahabas)) return false;

          // Check if hadith contains all selected sahabas
          const hadithSahabaNames = h.mentionedSahabas.map((s) => s.name);

          // All selected sahabas must be present in the hadith
          return sahabas.every((sahaba) => hadithSahabaNames.includes(sahaba));
        });
      }
      break;
    case "word":
      if (query.length >= 3) {
        const q = query.toLowerCase();
        return hadiths.filter((h) => {
          const inMatnFr = h.matn_fr.toLowerCase().includes(q);
          const inMatnAr = h.matn_ar.toLowerCase().includes(q);
          const inNarrator = h.narrator.name.toLowerCase().includes(q);
          const inSahabas = h.mentionedSahabas.some((s) =>
            s.name.toLowerCase().includes(q)
          );

          return inMatnFr || inMatnAr || inNarrator || inSahabas;
        });
      }
      break;
    default:
      return [];
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
  // Safely handle useSearchParams (can be null in test environments)
  const rawSearchParams = useSearchParams();
  const searchParams = rawSearchParams ?? new URLSearchParams();

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

  // Timer for URL updates only
  const [urlUpdateTimer, setUrlUpdateTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Immediate search function
  const performSearch = (
    searchFilterMode: FilterType,
    searchQuery: string,
    searchNarrator: string,
    searchSelectedSahabas: string[]
  ) => {
    const hasCriteria =
      (searchFilterMode === "word" && searchQuery.length >= 3) ||
      (searchFilterMode === "narrator" && searchNarrator) ||
      (searchFilterMode === "sahaba" && searchSelectedSahabas.length > 0);

    if (hasCriteria) {
      const filteredResults = filterHadiths(hadiths, {
        filterMode: searchFilterMode,
        query: searchQuery,
        narrator: searchNarrator,
        sahabas: searchSelectedSahabas,
      });
      setResults(filteredResults);
      setHasSearched(true);
    } else {
      setResults([]);
      if (searchFilterMode !== "word" || searchQuery.length === 0) {
        setHasSearched(false);
      }
    }
  };

  // Update URL function
  const updateUrl = (
    urlFilterMode: FilterType,
    urlQuery: string,
    urlNarrator: string,
    urlSelectedSahabas: string[]
  ) => {
    const params = new URLSearchParams();
    params.set("filterMode", urlFilterMode);

    if (urlFilterMode === "word" && urlQuery) {
      params.set("query", urlQuery);
    } else if (urlFilterMode === "narrator" && urlNarrator) {
      params.set("query", urlNarrator);
    } else if (urlFilterMode === "sahaba" && urlSelectedSahabas.length > 0) {
      urlSelectedSahabas.forEach((sahaba) => params.append("query", sahaba));
    }

    const newUrl = `/search?${params.toString()}`;
    window.history.pushState(null, "", newUrl);
  };

  // Effect for immediate search
  useEffect(() => {
    performSearch(filterMode, query, narrator, selectedSahabas);
  }, [filterMode, query, narrator, selectedSahabas]);

  // Effect for debounced URL update
  useEffect(() => {
    if (urlUpdateTimer) {
      clearTimeout(urlUpdateTimer);
    }

    const timer = setTimeout(() => {
      updateUrl(filterMode, query, narrator, selectedSahabas);
    }, 300);

    setUrlUpdateTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [filterMode, query, narrator, selectedSahabas]);

  // Function to handle filter mode change and reset fields
  const handleFilterModeChange = (newMode: FilterType) => {
    setFilterMode(newMode);
    setQuery("");
    setNarrator("");
    setSelectedSahabas([]);

    setResults([]);
    setHasSearched(false);

    // Clear timer and update URL immediately
    if (urlUpdateTimer) {
      clearTimeout(urlUpdateTimer);
    }
    updateUrl(newMode, "", "", []);
  };

  // Automatically search if there are criteria in the URL (for URL sharing)
  useEffect(() => {
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
  }, []);

  return (
    <div>
      <form
        className="mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (urlUpdateTimer) {
            clearTimeout(urlUpdateTimer);
          }
          updateUrl(filterMode, query, narrator, selectedSahabas);
        }}
        autoComplete="off"
      >
        <div className="grid grid-cols-3 gap-2 mb-4">
          <label
            className={`flex items-center justify-center gap-2 cursor-pointer p-2 rounded-md border text-center text-sm transition ${
              filterMode === "word"
                ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-medium"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-medium"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-medium"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                placeholder="Rechercher par mot (3 lettres min)..."
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-600 bg-white dark:bg-gray-800 dark:text-gray-200"
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
            className="w-full sm:w-auto p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition focus:outline-none dark:bg-emerald-700 dark:hover:bg-emerald-800 border border-emerald-600 hover:border-emerald-700 dark:border-emerald-700 dark:hover:border-emerald-800"
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
              <p className="text-red-400 italic">
                Merci de saisir au moins 3 lettres pour la recherche par mot.
              </p>
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
                <p className="text-gray-500 italic">
                  Aucun hadith ne correspond à votre recherche.
                </p>
              )}
          </>
        ) : (
          <p className="text-gray-400 italic">
            Veuillez saisir vos critères et cliquer sur "Rechercher".
          </p>
        )}
      </div>
    </div>
  );
}
