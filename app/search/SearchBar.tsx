/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { useSearch } from "@/src/hooks/useSearch";
import { FilterType } from "@/src/types/types";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { MultiSelect } from "@/src/ui/inputs/MultiSelect/MultiSelect";
import { SearchSelect } from "@/src/ui/inputs/SearchSelect/SearchSelect";

function extractInitials(sp: URLSearchParams) {
  const filterMode = (sp.get("filterMode") as FilterType) || "word";
  const query = sp.get("query") || "";
  const narrator = sp.get("narrator") || "";
  const numero = sp.get("numero") || "";

  let sahabas: string[] = [];
  if (sp.has("sahaba")) {
    const queryParams = sp.getAll("sahaba");
    if (queryParams.length > 0) {
      sahabas = queryParams.filter(Boolean);
    }
  }

  let transmitters: string[] = [];
  if (sp.has("transmitter")) {
    const queryParams = sp.getAll("transmitter");
    if (queryParams.length > 0) {
      transmitters = queryParams.filter(Boolean);
    }
  }

  return {
    filterMode,
    query,
    narrator,
    sahabas,
    transmitters,
    numero,
  };
}

export function SearchBar({
  narrators,
  sahabas,
  transmitters,
}: {
  narrators: string[];
  sahabas: string[];
  transmitters: string[];
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
  const [selectedTransmitters, setSelectedTransmitters] = useState<string[]>(
    initialValues.transmitters
  );
  const [numero, setNumero] = useState(initialValues.numero);

  // Use our optimized search hook
  const { results, isLoading, hasSearched } = useSearch({
    filterMode,
    query,
    narrator,
    sahabas: selectedSahabas,
    transmitters: selectedTransmitters,
    numero,
  });

  // Timer for URL updates only
  const [urlUpdateTimer, setUrlUpdateTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Update URL function
  const updateUrl = (
    urlFilterMode: FilterType,
    urlQuery: string,
    urlNarrator: string,
    urlSelectedSahabas: string[],
    urlSelectedTransmitters: string[],
    urlNumero: string
  ) => {
    const params = new URLSearchParams();
    params.set("filterMode", urlFilterMode);

    if (urlFilterMode === "word" && urlQuery) {
      params.set("query", urlQuery);
    } else if (urlFilterMode === "narrator" && urlNarrator) {
      params.set("narrator", urlNarrator);
    } else if (urlFilterMode === "sahaba" && urlSelectedSahabas.length > 0) {
      urlSelectedSahabas.forEach((sahaba) => params.append("sahaba", sahaba));
    } else if (
      urlFilterMode === "transmitter" &&
      urlSelectedTransmitters.length > 0
    ) {
      urlSelectedTransmitters.forEach((transmitter) =>
        params.append("transmitter", transmitter)
      );
    } else if (urlFilterMode === "numero" && urlNumero) {
      params.set("numero", urlNumero);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  // Handle filter mode change
  const handleFilterModeChange = (newFilterMode: FilterType) => {
    setFilterMode(newFilterMode);
    updateUrl(newFilterMode, "", "", [], [], "");
  };

  // Handle search input changes with debounced URL updates
  const handleSearchChange = (
    newQuery: string,
    newNarrator: string,
    newSelectedSahabas: string[],
    newSelectedTransmitters: string[],
    newNumero: string
  ) => {
    setQuery(newQuery);
    setNarrator(newNarrator);
    setSelectedSahabas(newSelectedSahabas);
    setSelectedTransmitters(newSelectedTransmitters);
    setNumero(newNumero);

    // Debounce URL updates
    if (urlUpdateTimer) {
      clearTimeout(urlUpdateTimer);
    }

    const timer = setTimeout(() => {
      updateUrl(
        filterMode,
        newQuery,
        newNarrator,
        newSelectedSahabas,
        newSelectedTransmitters,
        newNumero
      );
    }, 500);

    setUrlUpdateTimer(timer);
  };

  // Initialize values from URL on component mount
  useEffect(() => {
    const initValues = extractInitials(searchParams);
    setFilterMode(initValues.filterMode);
    setQuery(initValues.query);
    setNarrator(initValues.narrator);
    setSelectedSahabas(initValues.sahabas);
    setSelectedTransmitters(initValues.transmitters);
    setNumero(initValues.numero);
  }, []);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (urlUpdateTimer) {
        clearTimeout(urlUpdateTimer);
      }
    };
  }, [urlUpdateTimer]);

  return (
    <div>
      <form
        className="mb-6"
        autoComplete="off"
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
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
            <span>Par Compagnon</span>
          </label>
          <label
            className={`flex items-center justify-center gap-2 cursor-pointer p-2 rounded-md border text-center text-sm transition ${
              filterMode === "transmitter"
                ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-medium"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <input
              type="radio"
              name="filterMode"
              value="transmitter"
              checked={filterMode === "transmitter"}
              onChange={() => handleFilterModeChange("transmitter")}
              className="sr-only"
            />
            <span>Par Transmetteur</span>
          </label>
          <label
            className={`flex items-center justify-center gap-2 cursor-pointer p-2 rounded-md border text-center text-sm transition ${
              filterMode === "numero"
                ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-medium"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <input
              type="radio"
              name="filterMode"
              value="numero"
              checked={filterMode === "numero"}
              onChange={() => handleFilterModeChange("numero")}
              className="sr-only"
            />
            <span>Par Numéro</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-2 sm:items-start gap-2 sm:gap-0">
          <div className="flex-1 w-full">
            {filterMode === "word" && (
              <div className="relative">
                <input
                  type="text"
                  name="queryInput"
                  value={query}
                  onChange={(e) =>
                    handleSearchChange(
                      e.target.value,
                      narrator,
                      selectedSahabas,
                      selectedTransmitters,
                      numero
                    )
                  }
                  placeholder="Rechercher par mot (3 lettres min)..."
                  className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-600 bg-white dark:bg-gray-800 dark:text-gray-200"
                  autoFocus
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
            )}
            {filterMode === "narrator" && (
              <SearchSelect
                id="narrator-select"
                label=""
                options={narrators}
                value={narrator}
                onChange={(value) =>
                  handleSearchChange(
                    query,
                    value,
                    selectedSahabas,
                    selectedTransmitters,
                    numero
                  )
                }
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
                onChange={(values) =>
                  handleSearchChange(
                    query,
                    narrator,
                    values,
                    selectedTransmitters,
                    numero
                  )
                }
                placeholder="Choisir un ou plusieurs rapporteurs"
                name="sahabaInput"
              />
            )}
            {filterMode === "transmitter" && (
              <MultiSelect
                id="transmitter-multiselect"
                label=""
                options={transmitters}
                selected={selectedTransmitters}
                onChange={(values) =>
                  handleSearchChange(
                    query,
                    narrator,
                    selectedSahabas,
                    values,
                    numero
                  )
                }
                placeholder="Choisir un ou plusieurs transmetteurs"
                name="transmitterInput"
              />
            )}
            {filterMode === "numero" && (
              <div className="relative">
                <input
                  type="number"
                  name="numeroInput"
                  value={numero}
                  onChange={(e) =>
                    handleSearchChange(
                      query,
                      narrator,
                      selectedSahabas,
                      selectedTransmitters,
                      e.target.value
                    )
                  }
                  placeholder="Numéro du hadith"
                  className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-600 bg-white dark:bg-gray-800 dark:text-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                  autoFocus
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Validation Messages */}
      {filterMode === "word" && query.length > 0 && query.length < 3 && (
        <p className="text-red-400 italic">
          Merci de saisir au moins 3 lettres pour la recherche par mot.
        </p>
      )}

      {isLoading && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          Recherche en cours...
        </div>
      )}

      {/* Search Stats */}
      {(results.length > 0 || hasSearched) && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {results.length > 0
            ? `${results.length} hadith${results.length > 1 ? "s" : ""} trouvé${results.length > 1 ? "s" : ""}`
            : hasSearched && !isLoading
              ? "Aucun hadith trouvé"
              : ""}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((hadith) => (
            <Hadith
              key={hadith.id}
              hadith={hadith}
              highlight={filterMode === "word" ? query : ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
