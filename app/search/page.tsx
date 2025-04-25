import { Metadata } from "next";

import { getAllHadiths } from "@/src/services/services";
import { FilterType, HadithType } from "@/src/types/types";
import { BadgeNumberOfHadith } from "@/src/ui/BadgeNumberOfHadith";
import { Hadith } from "@/src/ui/hadith/Hadith";
import { SearchBar } from "@/src/ui/inputs/SearchBar";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Extract unique narrator and sahaba names from hadiths
function getUnique(hadiths: HadithType[]) {
  // Get unique narrator names
  const narratorNames = [
    ...new Set(hadiths.map((h) => h.narrator?.name).filter(Boolean)),
  ];
  // Get unique sahaba names
  const sahabaNames = [
    ...new Set(
      hadiths
        .flatMap((h) => h.mentionedSahabas?.map((s) => s.name) || [])
        .filter(Boolean)
    ),
  ];
  return { narratorNames, sahabaNames };
}

// Extract initial filter values from searchParams
function extractInitials(sp: { [key: string]: string | string[] | undefined }) {
  const filterMode = (sp.filterMode as FilterType) || "word";
  let query = "";
  let narrator = "";
  let sahabas: string[] = [];

  const queryParam = sp.query;

  if (filterMode === "word") {
    query = typeof queryParam === "string" ? queryParam.trim() : "";
  } else if (filterMode === "narrator") {
    narrator = typeof queryParam === "string" ? queryParam : "";
  } else if (filterMode === "sahaba") {
    sahabas = Array.isArray(queryParam)
      ? queryParam
      : typeof queryParam === "string"
        ? [queryParam]
        : [];
  }

  // For backward compatibility - still support the old URL format
  if (!query && typeof sp.narrator === "string" && filterMode === "narrator") {
    narrator = sp.narrator;
  }
  if (sahabas.length === 0 && filterMode === "sahaba") {
    const sahabaParam = sp.sahaba;
    if (Array.isArray(sahabaParam)) {
      sahabas = sahabaParam;
    } else if (typeof sahabaParam === "string") {
      sahabas = [sahabaParam];
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
    return hadiths.filter(
      (h) =>
        h.matn_fr.toLowerCase().includes(q) ||
        h.matn_ar.includes(q) ||
        h.narrator.name.toLowerCase().includes(q) ||
        h.mentionedSahabas.some((s) => s.name.toLowerCase().includes(q))
    );
  }
  return [];
}

// Generate static metadata
export async function generateMetadata(): Promise<Metadata> {
  const title = "Rechercher dans Moslim";
  const description =
    "Recherchez des hadiths authentiques dans la collection Sahih Moslim.";

  return {
    title,
    description,
  };
}

// Main page
export default async function SearchPage(props: {
  searchParams: SearchParams;
}) {
  const sp = await props.searchParams;
  const { filterMode, query, narrator, sahabas } = extractInitials(sp);
  const hadiths = await getAllHadiths();
  const { narratorNames, sahabaNames } = getUnique(hadiths);
  const filtered = filterHadiths(hadiths, {
    filterMode,
    query,
    narrator,
    sahabas,
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-serif font-bold text-center text-emerald-800 mb-8 md:mb-12 tracking-tight">
        Rechercher un Hadith
      </h1>
      <SearchBar
        initialFilterMode={filterMode}
        initialWord={query}
        initialNarrator={narrator}
        initialSahabas={sahabas}
        narrators={narratorNames}
        sahabas={sahabaNames}
      />
      <div className="space-y-8 mt-8">
        <BadgeNumberOfHadith
          count={filtered.length}
          size="large"
        />
        {filterMode === "word" && query && query.length < 3 && (
          <div className="text-gray-500 italic">
            Merci de saisir au moins 3 lettres pour la recherche par mot.
          </div>
        )}
        {filtered.map((hadith) => (
          <Hadith
            key={hadith.id}
            hadith={hadith}
          />
        ))}
        {filtered.length === 0 &&
          (query || narrator || sahabas.length > 0) &&
          !(filterMode === "word" && query && query.length < 3) && (
            <div className="text-gray-500 italic">
              Aucun hadith ne correspond à votre recherche.
            </div>
          )}
      </div>
    </div>
  );
}
