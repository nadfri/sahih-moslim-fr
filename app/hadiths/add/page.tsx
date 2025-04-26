import { Metadata } from "next";
import { redirect } from "next/navigation";

// Import services to fetch data
import {
  getAllChapters,
  getAllNarrators,
  getAllSahabas,
  getHadithNumeros,
} from "@/src/services/services";
import { AddHadithForm } from "@/src/ui/hadith/AddHadithForm";

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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl md:text-4xl font-bold text-emerald-700 mb-6 md:mb-8">
        Ajouter un nouveau hadith
      </h1>
      <AddHadithForm
        initialNumeros={initialNumeros}
        chaptersData={chaptersData}
        narratorsData={narratorsData}
        sahabasData={sahabasData}
      />
    </div>
  );
}
