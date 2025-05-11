/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { getAllHadiths } from "@/src/services/services";
import { BadgeNumberOfHadith } from "@/src/ui/BadgeNumberOfHadith/BadgeNumberOfHadith";
import { Descriptive } from "@/src/ui/Descriptive/Descriptive";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";

export default async function Home() {
  const hadiths = await getAllHadiths();
  return (
    <>
      <h1 className="title">Sahih Moslim en français</h1>

      <Descriptive />

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
