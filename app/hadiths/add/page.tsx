import { Metadata } from "next";
import { redirect } from "next/navigation";

// Import services to fetch data
import {
  getAllChapters,
  getAllNarrators,
  getAllSahabas,
  getHadithNumeros,
} from "@/src/services/services";
import { AddHadithForm } from "@/src/ui/hadith/forms/AddHadithForm";

export const metadata: Metadata = {
  title: "Ajouter un hadith",
  description: "Ajoutez un nouveau hadith à la base de données.",
};

export default async function AddHadithPage() {
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }

  const [initialNumeros, chaptersData, narratorsData, sahabasData] =
    await Promise.all([
      getHadithNumeros(),
      getAllChapters(),
      getAllNarrators(),
      getAllSahabas(),
    ]);

  return (
    <>
      <h1 className="title">Ajouter un nouveau hadith</h1>
      <AddHadithForm
        initialNumeros={initialNumeros}
        chaptersData={chaptersData}
        narratorsData={narratorsData}
        sahabasData={sahabasData}
      />
    </>
  );
}
