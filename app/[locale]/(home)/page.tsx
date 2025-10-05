/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { getAllHadiths } from "@/src/services/services";
import { ParamsLocale } from "@/src/types/types";
import { Descriptive } from "@/app/[locale]/(home)/Descriptive/Descriptive";
import { ListLayoutHadith } from "@/src/ui/hadith/ListLayoutHadith/ListLayoutHadith";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

export default async function Home({ params }: { params: ParamsLocale }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const hadiths = await getAllHadiths();

  const t = await getTranslations("home");
  return (
    <>
      <h1 className="title">{t("title")}</h1>

      <Descriptive />

      <ListLayoutHadith hadiths={hadiths} />
    </>
  );
}
