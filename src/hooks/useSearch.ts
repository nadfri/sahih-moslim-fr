/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { useEffect, useState } from "react";

import { FilterType, HadithType } from "@/src/types/types";

export type SearchApiResponse = {
  success: boolean;
  results: HadithType[];
  count: number;
  hasMore: boolean;
  error?: string;
};

export type UseSearchProps = {
  filterMode: FilterType;
  query: string;
  narrator: string;
  sahabas: string[];
  transmitters: string[];
  numero: string;
  debounceMs?: number;
};

const DEBOUNCE_MS = 300;

export function useSearch({
  filterMode,
  query,
  narrator,
  sahabas,
  transmitters,
  numero,
}: UseSearchProps) {
  const [results, setResults] = useState<HadithType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced effect - use JSON.stringify for array dependencies
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Check if we have search criteria
      const hasCriteria =
        (filterMode === "word" && query.length >= 3) ||
        (filterMode === "narrator" && narrator) ||
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
        // Build search params - no need to send filterMode as it can be inferred
        const searchParams = new URLSearchParams();

        if (filterMode === "word" && query) {
          searchParams.set("query", query);
        } else if (filterMode === "narrator" && narrator) {
          searchParams.set("narrator", narrator);
        } else if (filterMode === "sahaba" && sahabas.length > 0) {
          sahabas.forEach((sahaba) => searchParams.append("sahaba", sahaba));
        } else if (filterMode === "transmitter" && transmitters.length > 0) {
          transmitters.forEach((transmitter) =>
            searchParams.append("transmitter", transmitter)
          );
        } else if (filterMode === "numero" && numero) {
          searchParams.set("numero", numero);
        }

        // Make API call
        const response = await fetch(`/api/search?${searchParams.toString()}`);
        const data: SearchApiResponse = await response.json();

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
  }, [filterMode, query, narrator, sahabas, transmitters, numero]);

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
