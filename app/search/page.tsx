/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";

import { SearchBar } from "@/app/search/SearchBar";
import {
  getNarratorNames,
  getSahabaNames,
  getTransmitterNames,
} from "@/src/services/services";

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

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
  const [narratorNames, sahabaNames, transmitterNames] = await Promise.all([
    getNarratorNames(),
    getSahabaNames(),
    getTransmitterNames(),
  ]);

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">Rechercher un Hadith</h1>

      <SearchBar
        narrators={narratorNames}
        sahabas={sahabaNames}
        transmitters={transmitterNames}
      />
    </div>
  );
}
