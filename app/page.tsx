/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { getAllHadiths } from "@/src/services/services";
import { Hadith } from "@/src/ui/hadith/Hadith";

export default async function Home() {
  const hadiths = await getAllHadiths();
  return (
    <div>
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-center text-emerald-800 mb-8 md:mb-12 tracking-tight">
        Sahih Moslim en français
      </h1>
      <p className="text-center mb-4">
        Bienvenue sur le site dédié à la collection de hadiths Sahih Moslim en
        français. Vous trouverez ici une sélection de hadiths authentiques du
        Prophète Muhammad ﷺ.
      </p>
      {/* Replace the paragraph with a styled badge */}
      <div className="mb-6">
        <span className="inline-block bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
          Nombre de hadiths: {hadiths.length}
        </span>
      </div>

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
