/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { AddHadithForm } from "@/ui/hadith/AddHadithForm";

export default function AddHadithPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-emerald-700 mb-8">
        Ajouter un nouveau hadith
      </h1>
      <AddHadithForm />
    </div>
  );
}
