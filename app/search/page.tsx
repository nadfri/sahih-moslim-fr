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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-serif font-bold text-center text-emerald-800 mb-8 md:mb-12 tracking-tight">
        Rechercher un Hadith
      </h1>

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
