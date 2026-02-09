/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { useSearch } from "../useSearch";
import { FilterType, HadithType } from "@/src/types/types";
import { MultiSelect } from "@/src/ui/forms/inputs/MultiSelect/MultiSelect";
import {
  buildSearchParams,
  detectFilterMode,
  extractSearchParams,
} from "@/src/utils/searchUtils";

type SearchBarProps = {
  sahabas: string[];
  transmitters: string[];
  onSearchResults: (
    results: HadithType[],
    isLoading: boolean,
    hasSearched: boolean,
    highlight: string
  ) => void;
};

export function SearchBar({
  sahabas,
  transmitters,
  onSearchResults,
}: SearchBarProps) {
  const t = useTranslations("search");
  const locale = useLocale();
  const filterOptions: { key: FilterType; label: string }[] = [
    { key: "word", label: t("filters.word") },
    { key: "sahaba", label: t("filters.sahaba") },
    { key: "transmitter", label: t("filters.transmitter") },
    { key: "numero", label: t("filters.numero") },
  ];

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
    locale,
  });

  // Timer for URL updates only
  const [urlUpdateTimer, setUrlUpdateTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Notify parent component of search results
  useEffect(() => {
    const highlight = filterMode === "word" ? query : "";
    onSearchResults(results, isLoading, hasSearched, highlight);
  }, [results, isLoading, hasSearched, filterMode, query, onSearchResults]);

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
    setQuery("");
    setSelectedSahabas([]);
    setSelectedTransmitters([]);
    setNumero("");
    // Update URL to reflect reset state
    const params = buildSearchParams(newFilterMode, "", [], [], "");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
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
        aria-labelledby="search-form-legend"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => handleFilterModeChange(option.key)}
              className={`flex items-center justify-center gap-2 cursor-pointer p-2 rounded-md border text-center text-sm ${
                filterMode === option.key
                  ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-medium"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
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
                  aria-label={t("placeholders.wordInput")}
                  className="w-full p-2 ps-7 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-600 bg-white dark:bg-gray-800 dark:text-gray-200"
                  aria-invalid={
                    filterMode === "word" &&
                    query.length > 0 &&
                    query.length < 3
                  }
                  aria-describedby={
                    filterMode === "word" &&
                    query.length > 0 &&
                    query.length < 3
                      ? "search-query-error"
                      : undefined
                  }
                  autoComplete="off"
                />
                <Search className="absolute start-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
            )}
            {filterMode === "sahaba" && (
              <MultiSelect
                id="sahaba-multiselect"
                label={t("placeholders.sahabaSelect")}
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
                aria-label={t("placeholders.sahabaSelect")}
              />
            )}
            {filterMode === "transmitter" && (
              <MultiSelect
                id="transmitter-multiselect"
                label={t("placeholders.transmitterSelect")}
                options={transmitters}
                selected={selectedTransmitters}
                onChange={(values) =>
                  handleSearchChange(query, selectedSahabas, values, numero)
                }
                placeholder={t("placeholders.transmitterSelect")}
                name="transmitterInput"
                aria-label={t("placeholders.transmitterSelect")}
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
                  aria-label={t("placeholders.numeroInput")}
                  className="w-full p-2 pe-10 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-600 bg-white dark:bg-gray-800 dark:text-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                  autoComplete="off"
                />
                <Search className="absolute end-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Validation Messages */}
      {filterMode === "word" && query.length > 0 && query.length < 3 && (
        <p
          id="search-query-error"
          className="text-red-400 italic"
          role="alert"
          aria-live="assertive"
        >
          {t("validation.min3letters")}
        </p>
      )}

      {isLoading && (
        <div
          className="text-center text-gray-600 dark:text-gray-400"
          role="status"
          aria-live="polite"
        >
          {t("loading")}
        </div>
      )}
    </div>
  );
}
