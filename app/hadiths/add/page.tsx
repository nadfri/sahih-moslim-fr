/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";

// Import services to fetch data
import {
  getAllChapters,
  getAllNarrators,
  getAllSahabas,
  getAllTransmitters,
  getHadithNumeros,
} from "@/src/services/services";
import { AddHadithForm } from "@/src/ui/forms/AddHadithForm";

export const metadata: Metadata = {
  title: "Ajouter un hadith",
  description: "Ajoutez un nouveau hadith à la base de données.",
};

export default async function AddHadithPage() {
  const [
    initialNumeros,
    chaptersData,
    narratorsData,
    sahabasData,
    transmittersData,
  ] = await Promise.all([
    getHadithNumeros(),
    getAllChapters(),
    getAllNarrators(),
    getAllSahabas(),
    getAllTransmitters(),
  ]);

  return (
    <>
      <h1 className="title">Ajouter un nouveau hadith</h1>
      <AddHadithForm
        initialNumeros={initialNumeros}
        chaptersData={chaptersData}
        narratorsData={narratorsData}
        sahabasData={sahabasData}
        transmittersData={transmittersData}
      />
    </>
  );
}
