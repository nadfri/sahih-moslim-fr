/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { getAllHadiths } from "@/src/services/services";
import { Hadith } from "../src/ui/hadith/Hadith";

export default function Home() {
  const hadiths = getAllHadiths();
  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-emerald-800 mb-10 md:mb-16 tracking-tight">
        Sahih Moslim en français
      </h1>
      <p className="text-center mb-4">
        Bienvenue sur le site dédié à la collection de hadiths Sahih Moslim en
        français. Vous trouverez ici une sélection de hadiths authentiques du
        Prophète Muhammad (sws).
      </p>
      <p className="text-lg mb-4">Nombre de hadiths: {hadiths.length}</p>

      <div className="space-y-8">
        {hadiths.map((hadith) => (
          <Hadith
            key={hadith.id}
            hadith={hadith}
          />
        ))}
      </div>
    </div>
  );
}
