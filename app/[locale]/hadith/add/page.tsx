/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";

// Import services to fetch data
import {
  getAllChapters,
  getAllSahabas,
  getAllTransmitters,
} from "@/src/services/services";
import { enforceAdminAccess } from "@/src/lib/auth/supabase/helpers";
import { AddHadithForm } from "@/src/ui/forms/hadith-forms/AddHadithForm";
import prisma from "@/prisma/prisma";

export const metadata: Metadata = {
  title: "Ajouter un hadith",
  description: "Ajoutez un nouveau hadith à la base de données.",
};

export default async function AddHadithPage() {
  // Enforce admin access at page level
  await enforceAdminAccess();

  // Calculate next numero server-side
  const maxHadith = await prisma.hadith.findFirst({
    orderBy: { numero: "desc" },
    select: { numero: true },
  });
  const nextNumero = (maxHadith?.numero ?? 0) + 1;

  const [chaptersData, sahabasData, transmittersData] = await Promise.all([
    getAllChapters(),
    getAllSahabas(),
    getAllTransmitters(),
  ]);

  return (
    <>
      <h1 className="title">Ajouter un nouveau hadith</h1>
      <AddHadithForm
        initialNumero={nextNumero}
        chaptersData={chaptersData}
        sahabasData={sahabasData}
        transmittersData={transmittersData}
      />
    </>
  );
}
