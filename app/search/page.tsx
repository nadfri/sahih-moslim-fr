import { getAllHadiths } from "@/src/services/services";
import { HadithType } from "@/src/types/types";
import { Hadith } from "@/src/ui/hadith/Hadith";
import { SearchBar } from "@/src/ui/inputs/SearchBar"; // SearchBar is now a Client Component

// Type for awaited searchParams
type SearchParams = { [key: string]: string | string[] | undefined };
type FilterType = "word" | "narrator" | "sahaba";

function getUnique(hadiths: HadithType[]) {
  const narrators = Array.from(
    new Set(hadiths.map((hadith) => hadith.narrator).filter(Boolean))
  );
  const sahabas = Array.from(
    new Set(hadiths.flatMap((hadith) => hadith.sahabas || []))
  );
  return { narrators, sahabas };
}

export default async function SearchPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  // Read initial values from URL search params on the server
  const initialFilterMode = (searchParams.filterMode as FilterType) || "word";

  const initialQuery =
    typeof searchParams.query === "string" ? searchParams.query.trim() : "";
  const initialNarrator =
    typeof searchParams.narrator === "string" ? searchParams.narrator : "";
  const initialSahaba =
    typeof searchParams.sahaba === "string" ? searchParams.sahaba : "";

  const hadiths = getAllHadiths();
  const { narrators, sahabas } = getUnique(hadiths);

  let filtered: HadithType[] = [];

  switch (initialFilterMode) {
    case "narrator":
      if (initialNarrator) {
        filtered = hadiths.filter(
          (hadith) => hadith.narrator === initialNarrator
        );
      }
      break;

    case "sahaba":
      if (initialSahaba) {
        filtered = hadiths.filter((hadith) =>
          hadith.sahabas.includes(initialSahaba)
        );
      }
      break;

    case "word":
      if (initialQuery && initialQuery.length >= 3) {
        const q = initialQuery.toLowerCase();
        filtered = hadiths.filter(
          (hadith) =>
            hadith.matn.toLowerCase().includes(q) ||
            hadith.arabic.includes(q) ||
            hadith.narrator.toLowerCase().includes(q) ||
            hadith.sahabas.some((sahaba) => sahaba.toLowerCase().includes(q))
        );
      }
      break;

    default:
      filtered = [];
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Pass initial values and data to the Client Component SearchBar */}
      <SearchBar
        initialFilterMode={initialFilterMode}
        initialWord={initialQuery}
        initialNarrator={initialNarrator}
        initialSahaba={initialSahaba}
        narrators={narrators}
        sahabas={sahabas}
      />
      {/* Display filtered hadiths (rendered on the server) */}
      <div className="space-y-8">
        {initialFilterMode === "word" &&
          initialQuery &&
          initialQuery.length < 3 && (
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
        {/* Optional: Add message if filters are active but no results */}
        {filtered.length === 0 &&
          (initialQuery || initialNarrator || initialSahaba) &&
          !(
            initialFilterMode === "word" &&
            initialQuery &&
            initialQuery.length < 3
          ) && (
            <div className="text-gray-500 italic">
              Aucun hadith ne correspond à votre recherche.
            </div>
          )}
      </div>
    </div>
  );
}
