/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getHadithByNumero } from "@/src/services/services";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { HadithSkeleton } from "@/src/ui/hadith/Hadith/HadithSkeleton";
import { getNarratorName } from "@/src/utils/getNarratorName";
import { ParamsNumero } from "@/src/types/types";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getLocalizedMatn } from "../utils/getLocalizedMatn";
import { HadithNavigation } from "./HadithNavigation";
import { getHadithNavigation } from "../utils/getHadithNavigation";

export default async function PageByNumero({
  params,
}: {
  params: ParamsNumero;
}) {
  const { numero, locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("hadith");

  // Parallel data fetching for better performance
  const [hadith, navData] = await Promise.all([
    getHadithByNumero(numero),
    getHadithNavigation(parseInt(numero)),
  ]);

  const { previousNumero, nextNumero } = navData;

  if (!hadith) {
    return notFound();
  }

  return (
    <>
      <h1 className="title">
        {t("title", {
          numero: hadith.numero,
          narrator: getNarratorName(hadith, locale) ?? "",
        })}
      </h1>

      {/* Suspense boundary for hadith content with skeleton fallback */}
      <Suspense fallback={<HadithSkeleton />}>
        <Hadith hadith={hadith} />
      </Suspense>

      <HadithNavigation
        previousNumero={previousNumero}
        nextNumero={nextNumero}
      />
    </>
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata({
  params,
}: {
  params: ParamsNumero;
}): Promise<Metadata> {
  const { numero, locale } = await params;

  const t = await getTranslations("hadith");

  const hadith = await getHadithByNumero(numero);

  if (!hadith) {
    return {
      title: t("notFound"),
    };
  }

  return {
    title:
      t("title", {
        numero: hadith.numero,
        narrator: getNarratorName(hadith, locale) ?? "",
      }) + " | Moslim",
    description: getLocalizedMatn(hadith, locale).substring(0, 160) + "...",
  };
}

/*Generate static paths for all hadiths*/
// export async function generateStaticParams() {
//   return moslim_fr.map((hadith) => ({
//     id: hadith.id.toString(),
//   }));
// }
