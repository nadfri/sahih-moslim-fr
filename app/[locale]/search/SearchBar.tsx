/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { useSearch } from "@/src/hooks/useSearch";
import { FilterType } from "@/src/types/types";
import { BadgeNumberOfHadith } from "@/src/ui/hadith/BadgeNumberOfHadith/BadgeNumberOfHadith";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { MultiSelect } from "@/src/ui/forms/inputs/MultiSelect/MultiSelect";
import {
  buildSearchParams,
  detectFilterMode,
  extractSearchParams,
} from "@/src/utils/searchUtils";
import { useAuth } from "@/src/hooks/useAuth";

export function SearchBar({
  sahabas,
  transmitters,
}: {
  sahabas: string[];
  transmitters: string[];
}) {
  const t = useTranslations("search");
  const { isAdmin } = useAuth();
  // Safely handle useSearchParams (can be null in test environments)
  const rawSearchParams = useSearchParams();
  const searchParams = rawSearchParams ?? new URLSearchParams();

  // Extract initial values using unified utility
  const initialParams = extractSearchParams(searchParams);
  const initialFilterMode = detectFilterMode(initialParams);

  const [filterMode, setFilterMode] = useState<FilterType>(initialFilterMode);
  const [query, setQuery] = useState(initialParams.query);
  const [selectedSahabas, setSelectedSahabas] = useState<string[]>(
    initialParams.sahabas
  );
  const [selectedTransmitters, setSelectedTransmitters] = useState<string[]>(
    initialParams.transmitters
  );
  const [numero, setNumero] = useState(initialParams.numero ?? "");

  const { results, isLoading, hasSearched } = useSearch({
    filterMode,
    query,
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
    urlSelectedSahabas: string[],
    urlSelectedTransmitters: string[],
    urlNumero: string
  ) => {
    const params = buildSearchParams(
      urlFilterMode,
      urlQuery,
      urlSelectedSahabas,
      urlSelectedTransmitters,
      urlNumero
    );
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  // Handle filter mode change
  const handleFilterModeChange = (newFilterMode: FilterType) => {
    setFilterMode(newFilterMode);
  };

  // Handle search input changes with debounced URL updates
  const handleSearchChange = (
    newQuery: string,
    newSelectedSahabas: string[],
    newSelectedTransmitters: string[],
    newNumero: string
  ) => {
    setQuery(newQuery);
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
        newSelectedSahabas,
        newSelectedTransmitters,
        newNumero
      );
    }, 500);
    setUrlUpdateTimer(timer);
  };

  useEffect(() => {
    const initValues = extractSearchParams(searchParams);
    const initFilterMode = detectFilterMode(initValues);
    setFilterMode(initFilterMode);
    setQuery(initValues.query);
    setSelectedSahabas(initValues.sahabas);
    setSelectedTransmitters(initValues.transmitters);
    setNumero(initValues.numero ?? "");
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
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
            <span>{t("filters.word")}</span>
          </label>
          {/* Narrator filter removed */}
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
            <span>{t("filters.sahaba")}</span>
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
            <span>{t("filters.transmitter")}</span>
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
            <span>{t("filters.numero")}</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-2 sm:items-start gap-2 sm:gap-0">
          <div className="flex-1 w-full">
            {filterMode === "word" && (
              <div className="relative">
                <input
                  type="text"
                  name="query"
                  value={query}
                  onChange={(e) =>
                    handleSearchChange(
                      e.target.value,
                      selectedSahabas,
                      selectedTransmitters,
                      numero
                    )
                  }
                  placeholder={t("placeholders.wordInput")}
                  className="w-full p-2 pe-10 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-600 bg-white dark:bg-gray-800 dark:text-gray-200"
                  autoFocus
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
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
                    values,
                    selectedTransmitters,
                    numero
                  )
                }
                placeholder={t("placeholders.sahabaSelect")}
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
                  handleSearchChange(query, selectedSahabas, values, numero)
                }
                placeholder={t("placeholders.transmitterSelect")}
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
                      selectedSahabas,
                      selectedTransmitters,
                      e.target.value
                    )
                  }
                  placeholder={t("placeholders.numeroInput")}
                  className="w-full p-2 pe-10 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-600 bg-white dark:bg-gray-800 dark:text-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
        <p className="text-red-400 italic">{t("validation.min3letters")}</p>
      )}

      {isLoading && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          {t("loading")}
        </div>
      )}

      {/* Search Stats */}
      {(results.length > 0 || hasSearched) && (
        <>
          {results.length > 0 ? (
            <BadgeNumberOfHadith
              count={results.length}
              size="large"
            />
          ) : hasSearched && !isLoading ? (
            <p className="text-gray-600 dark:text-gray-400">{t("empty")}</p>
          ) : null}
        </>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((hadith) => (
            <Hadith
              key={hadith.id}
              hadith={hadith}
              highlight={filterMode === "word" ? query : ""}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
