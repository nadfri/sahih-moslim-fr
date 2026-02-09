"use client";

import { useState, useCallback } from "react";
import { SearchBar } from "../SearchBar";
import { ListLayoutHadith } from "@/src/ui/hadith/ListLayoutHadith/ListLayoutHadith";
import { HadithType } from "@/src/types/types";

type SearchContainerProps = {
  sahabas: string[];
  transmitters: string[];
};

export function SearchContainer({
  sahabas,
  transmitters,
}: SearchContainerProps) {
  const [searchState, setSearchState] = useState<{
    results: HadithType[];
    isLoading: boolean;
    hasSearched: boolean;
    highlight: string;
  }>({
    results: [],
    isLoading: false,
    hasSearched: false,
    highlight: "",
  });

  const handleSearchResults = useCallback(
    (
      results: HadithType[],
      isLoading: boolean,
      hasSearched: boolean,
      highlight: string
    ) => {
      setSearchState({ results, isLoading, hasSearched, highlight });
    },
    []
  );

  return (
    <>
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
        onSearchResults={handleSearchResults}
      />
      {!searchState.isLoading && searchState.hasSearched && (
        <ListLayoutHadith
          hadiths={searchState.results}
          highlight={searchState.highlight}
        />
      )}
    </>
  );
}
