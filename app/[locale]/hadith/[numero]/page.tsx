/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHadithByNumero } from "@/src/services/services";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { getNarratorName } from "@/src/utils/getNarratorName";
import { requireAdmin } from "@/src/lib/auth/supabase/helpers";
import { ParamsNumero } from "@/src/types/types";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getLocalizedMatn } from "@/src/utils/getLocalizedMatn";
import { HadithNavigation } from "@/src/ui/hadith/HadithNavigation/HadithNavigation";
import { getHadithNavigation } from "@/src/services/getHadithNavigation";

export default async function PageByNumero({
  params,
}: {
  params: ParamsNumero;
}) {
  const { numero, locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("hadith");

  const adminCheck = await requireAdmin();

  const isAdmin = adminCheck === true;

  const hadith = await getHadithByNumero(numero);

  if (!hadith) {
    return notFound();
  }

  // Get navigation data for previous/next buttons
  const { previousNumero, nextNumero } = await getHadithNavigation(
    parseInt(numero)
  );

  return (
    <>
      <h1 className="title">
        {t("title", {
          numero: hadith.numero,
          narrator: getNarratorName(hadith, locale) ?? "",
        })}
      </h1>

      <Hadith
        hadith={hadith}
        isAdmin={isAdmin}
      />

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
