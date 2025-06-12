/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

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
  let transmitters: string[] = [];
  let numero = "";

  switch (filterMode) {
    case "word":
      query = queryParam?.trim() || "";
      break;
    case "narrator":
      narrator = queryParam || "";
      if (!narrator && sp.has("narrator")) {
        narrator = sp.get("narrator") || "";
      }
      break;
    case "sahaba":
      sahabas = queryParams.filter(Boolean);
      if (sahabas.length === 0 && sp.has("sahaba")) {
        sahabas = sp.getAll("sahaba");
      }
      break;
    case "transmitter":
      transmitters = queryParams.filter(Boolean);
      if (transmitters.length === 0 && sp.has("transmitter")) {
        transmitters = sp.getAll("transmitter");
      }
      break;
    case "numero":
      numero = queryParam?.trim() || "";
      break;
  }

  return { filterMode, query, narrator, sahabas, transmitters, numero };
}

// Filter hadiths based on filter mode and values
function filterHadiths(
  hadiths: HadithType[],
  {
    filterMode,
    query,
    narrator,
    sahabas,
    transmitters,
    numero,
  }: {
    filterMode: FilterType;
    query: string;
    narrator: string;
    sahabas: string[];
    transmitters: string[];
    numero?: string;
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
          const hadithSahabaNames = h.mentionedSahabas.map((s) => s.name);
          return sahabas.every((sahaba) => hadithSahabaNames.includes(sahaba));
        });
      }
      break;
    case "transmitter":
      if (transmitters.length > 0) {
        return hadiths.filter((h) => {
          if (!Array.isArray(h.isnadTransmitters)) return false;
          const hadithTransmitterNames = h.isnadTransmitters.map(
            (t: { name: string }) => t.name
          );
          return transmitters.every((transmitter) =>
            hadithTransmitterNames.includes(transmitter)
          );
        });
      }
      break;
    case "numero":
      if (numero && !isNaN(Number(numero))) {
        return hadiths.filter((h) => h.numero === Number(numero));
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
          const inTransmitters = h.isnadTransmitters?.some(
            (t: { name: string }) => t.name.toLowerCase().includes(q)
          );

          return (
            inMatnFr || inMatnAr || inNarrator || inSahabas || inTransmitters
          );
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
  transmitters,
}: {
  hadiths: HadithType[];
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
    searchSelectedSahabas: string[],
    searchSelectedTransmitters: string[],
    searchNumero: string
  ) => {
    const hasCriteria =
      (searchFilterMode === "word" && searchQuery.length >= 3) ||
      (searchFilterMode === "narrator" && searchNarrator) ||
      (searchFilterMode === "sahaba" && searchSelectedSahabas.length > 0) ||
      (searchFilterMode === "transmitter" &&
        searchSelectedTransmitters.length > 0) ||
      (searchFilterMode === "numero" &&
        searchNumero &&
        !isNaN(Number(searchNumero)));

    if (hasCriteria) {
      const filteredResults = filterHadiths(hadiths, {
        filterMode: searchFilterMode,
        query: searchQuery,
        narrator: searchNarrator,
        sahabas: searchSelectedSahabas,
        transmitters: searchSelectedTransmitters,
        numero: searchNumero,
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
    urlSelectedSahabas: string[],
    urlSelectedTransmitters: string[],
    urlNumero: string
  ) => {
    const params = new URLSearchParams();
    params.set("filterMode", urlFilterMode);

    if (urlFilterMode === "word" && urlQuery) {
      params.set("query", urlQuery);
    } else if (urlFilterMode === "narrator" && urlNarrator) {
      params.set("query", urlNarrator);
    } else if (urlFilterMode === "sahaba" && urlSelectedSahabas.length > 0) {
      urlSelectedSahabas.forEach((sahaba) => params.append("query", sahaba));
    } else if (
      urlFilterMode === "transmitter" &&
      urlSelectedTransmitters.length > 0
    ) {
      urlSelectedTransmitters.forEach((transmitter) =>
        params.append("query", transmitter)
      );
    } else if (urlFilterMode === "numero" && urlNumero) {
      params.set("query", urlNumero);
    }

    const newUrl = `/search?${params.toString()}`;
    window.history.pushState(null, "", newUrl);
  };
  // Effect for immediate search
  useEffect(() => {
    performSearch(
      filterMode,
      query,
      narrator,
      selectedSahabas,
      selectedTransmitters,
      numero
    );
  }, [
    filterMode,
    query,
    narrator,
    selectedSahabas,
    selectedTransmitters,
    numero,
  ]);
  // Effect for debounced URL update
  useEffect(() => {
    if (urlUpdateTimer) {
      clearTimeout(urlUpdateTimer);
    }

    const timer = setTimeout(() => {
      updateUrl(
        filterMode,
        query,
        narrator,
        selectedSahabas,
        selectedTransmitters,
        numero
      );
    }, 300);

    setUrlUpdateTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    filterMode,
    query,
    narrator,
    selectedSahabas,
    selectedTransmitters,
    numero,
  ]);
  // Function to handle filter mode change and reset fields
  const handleFilterModeChange = (newMode: FilterType) => {
    setFilterMode(newMode);
    setQuery("");
    setNarrator("");
    setSelectedSahabas([]);
    setSelectedTransmitters([]);
    setNumero("");

    setResults([]);
    setHasSearched(false);

    if (urlUpdateTimer) {
      clearTimeout(urlUpdateTimer);
    }
    updateUrl(newMode, "", "", [], [], "");
  };
  // Automatically search if there are criteria in the URL (for URL sharing)
  useEffect(() => {
    const hasCriteria =
      (filterMode === "word" && query) ||
      (filterMode === "narrator" && narrator) ||
      (filterMode === "sahaba" && selectedSahabas.length > 0) ||
      (filterMode === "transmitter" && selectedTransmitters.length > 0) ||
      (filterMode === "numero" && numero && !isNaN(Number(numero)));

    if (hasCriteria) {
      setResults(
        filterHadiths(hadiths, {
          filterMode,
          query,
          narrator,
          sahabas: selectedSahabas,
          transmitters: selectedTransmitters,
          numero,
        })
      );
      setHasSearched(true);
    }
  }, []);

  return (
    <div>
      {" "}
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
          </label>{" "}
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
            {" "}
            {filterMode === "word" && (
              <div className="relative">
                <input
                  type="text"
                  name="queryInput"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
            )}{" "}
            {filterMode === "transmitter" && (
              <MultiSelect
                id="transmitter-multiselect"
                label=""
                options={transmitters}
                selected={selectedTransmitters}
                onChange={setSelectedTransmitters}
                placeholder="Choisir un ou plusieurs transmetteurs"
                name="transmitterInput"
              />
            )}{" "}
            {filterMode === "numero" && (
              <div className="relative">
                <input
                  type="number"
                  name="numeroInput"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
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
            ))}{" "}
            {results.length === 0 &&
              (query ||
                narrator ||
                selectedSahabas.length > 0 ||
                selectedTransmitters.length > 0 ||
                numero) &&
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
