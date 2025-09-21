/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { getAllHadiths } from "@/src/services/services";
import { Descriptive } from "@/src/ui/Descriptive/Descriptive";
import { ListLayoutHadith } from "@/src/ui/hadith/ListLayoutHadith/ListLayoutHadith";

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

export default async function Home() {
  const hadiths = await getAllHadiths();
  return (
    <>
      <h1 className="title">Sahih Moslim en français</h1>

      <Descriptive />

      <ListLayoutHadith hadiths={hadiths} />
    </>
  );
}
