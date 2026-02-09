/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { useEffect, useState } from "react";

import { FilterType, HadithType } from "@/src/types/types";
import { buildSearchParams } from "@/src/utils/searchUtils";

export type UseSearchProps = {
  filterMode: FilterType;
  query: string;
  sahabas: string[];
  transmitters: string[];
  numero: string;
  locale?: string;
  debounceMs?: number;
};

const DEBOUNCE_MS = 300;

export function useSearch({
  filterMode,
  query,
  sahabas,
  transmitters,
  numero,
  locale = "fr",
}: UseSearchProps) {
  const [results, setResults] = useState<HadithType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      // Check if we have search criteria
      const hasCriteria =
        (filterMode === "word" && query.length >= 3) ||
        (filterMode === "sahaba" && sahabas.length > 0) ||
        (filterMode === "transmitter" && transmitters.length > 0) ||
        (filterMode === "numero" && numero && !isNaN(Number(numero)));

      if (!hasCriteria) {
        setResults([]);
        setHasSearched(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Build search params using utility
        const searchParams = buildSearchParams(
          filterMode,
          query,
          sahabas,
          transmitters,
          numero
        );

        // Add locale to search params
        searchParams.set("locale", locale);

        // Make API call
        const response = await fetch(`/api/search?${searchParams.toString()}`);
        const data = await response.json();

        if (data.success) {
          setResults(data.results);
          setHasSearched(true);
        } else {
          setError(data.error || "Search failed");
          setResults([]);
          setHasSearched(true);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Network error occurred");
        setResults([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [filterMode, query, sahabas, transmitters, numero, locale]);

  // Reset function
  const resetSearch = () => {
    setResults([]);
    setHasSearched(false);
    setError(null);
    setIsLoading(false);
  };

  return {
    results,
    isLoading,
    hasSearched,
    error,
    resetSearch,
  };
}
