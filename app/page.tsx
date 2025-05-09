/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { getAllHadiths } from "@/src/services/services";
import { BadgeNumberOfHadith } from "@/src/ui/BadgeNumberOfHadith/BadgeNumberOfHadith";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";

export default async function Home() {
  const hadiths = await getAllHadiths();
  return (
    <>
      <h1 className="title">Sahih Moslim en français</h1>

      <div className="max-w-3xl mx-auto my-8 p-6 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow-md">
        <p className="mb-3 text-gray-700 dark:text-gray-300">
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
            Sahih Muslim
          </span>{" "}
          est l'une des collections de hadiths les plus authentiques de l'islam,
          reconnue pour sa rigueur et sa fiabilité. Elle rassemble plus de{" "}
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
            3 033
          </span>{" "}
          récits du Prophète Muhammad ﷺ, soigneusement vérifiés et classés par
          thèmes.
        </p>
        <p className="mb-3 text-gray-700 dark:text-gray-300">
          Compilée au IX<sup>e</sup> siècle, cette œuvre occupe une place
          centrale dans la tradition musulmane, juste après le{" "}
          <em>Sahih al-Bukhari</em>. Elle est une référence majeure pour l'étude
          de la Sunna et du droit islamique.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
            L'Imam Muslim ibn al-Hajjaj
          </span>{" "}
          (821-875), originaire de Nishapur (actuel Iran), était un érudit
          réputé pour son intégrité et sa méthodologie stricte dans la collecte
          des hadiths. Son travail a profondément marqué la science du hadith.
        </p>
      </div>

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
