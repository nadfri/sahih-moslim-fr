import { Suspense } from "react";
import { Metadata } from "next";

import { SearchBar } from "@/app/search/SearchBar";
import {
  getAllHadiths,
  getNarratorNames,
  getSahabaNames,
} from "@/src/services/services";

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

export default async function SearchPage() {
  const [hadiths, narratorNames, sahabaNames] = await Promise.all([
    getAllHadiths(),
    getNarratorNames(),
    getSahabaNames(),
  ]);

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">Rechercher un Hadith</h1>

      <Suspense fallback={<p>Chargement...</p>}>
        <SearchBar
          hadiths={hadiths}
          narrators={narratorNames}
          sahabas={sahabaNames}
        />
      </Suspense>
    </div>
  );
}
