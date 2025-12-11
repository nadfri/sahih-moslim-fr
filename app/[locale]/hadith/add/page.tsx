/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";

// Import services to fetch data
import {
  getAllChapters,
  getAllSahabas,
  getAllTransmitters,
  getHadithNumeros,
} from "@/src/services/services";
import { enforceAdminAccess } from "@/src/lib/auth/supabase/helpers";
import { AddHadithForm } from "@/src/ui/forms/AddHadithForm";

export const metadata: Metadata = {
  title: "Ajouter un hadith",
  description: "Ajoutez un nouveau hadith à la base de données.",
};

export default async function AddHadithPage() {
  // Enforce admin access at page level
  await enforceAdminAccess();

  const [initialNumeros, chaptersData, sahabasData, transmittersData] =
    await Promise.all([
      getHadithNumeros(),
      getAllChapters(),
      getAllSahabas(),
      getAllTransmitters(),
    ]);

  return (
    <>
      <h1 className="title">Ajouter un nouveau hadith</h1>
      <AddHadithForm
        initialNumeros={initialNumeros}
        chaptersData={chaptersData}
        sahabasData={sahabasData}
        transmittersData={transmittersData}
      />
    </>
  );
}
