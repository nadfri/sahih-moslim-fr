/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { getAllHadiths } from "@/src/services/services";
import { BadgeNumberOfHadith } from "@/src/ui/BadgeNumberOfHadith/BadgeNumberOfHadith";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";

export default async function Home() {
  const hadiths = await getAllHadiths();
  return (
    <>
      <h1 className="title">Sahih Moslim en français</h1>

      <p className="text-center mb-4 dark:text-gray-300">
        Bienvenue sur le site dédié à la collection de hadiths Sahih Moslim en
        français. Vous trouverez ici une sélection de hadiths authentiques du
        Prophète Muhammad ﷺ.
      </p>

      <BadgeNumberOfHadith
        count={hadiths.length}
        size="large"
      />

      <div className="space-y-8">
        {hadiths.map((hadith) => (
          <Hadith
            key={hadith.id}
            hadith={hadith}
          />
        ))}
      </div>
    </>
  );
}
