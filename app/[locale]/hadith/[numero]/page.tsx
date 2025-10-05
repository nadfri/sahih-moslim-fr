/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHadithByNumero } from "@/src/services/services";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { getNarratorName } from "@/src/utils/getNarratorName";
import { requireAdmin } from "@/src/lib/auth/supabase/helpers";
import { ParamsType } from "@/src/types/types";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function PageByNumero({ params }: { params: ParamsType }) {
  const { numero, locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("hadith");

  const adminCheck = await requireAdmin();

  const isAdmin = adminCheck === true;

  const hadith = await getHadithByNumero(numero);

  if (!hadith) {
    return notFound();
  }

  return (
    <>
      <h1 className="title">
        {t("title", {
          numero: hadith.numero,
          narrator: getNarratorName(hadith) ?? "",
        })}
      </h1>

      <Hadith
        hadith={hadith}
        isAdmin={isAdmin}
      />
    </>
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const { numero } = await params;

  const t = await getTranslations("hadith");

  const hadith = await getHadithByNumero(numero);

  if (!hadith) {
    return {
      title: t("notFound"),
    };
  }

  return {
    title: t("title", {
      numero: hadith.numero,
      narrator: getNarratorName(hadith) ?? "",
    }),
    description: hadith.matn_fr.substring(0, 160) + "...",
  };
}

/*Generate static paths for all hadiths*/
// export async function generateStaticParams() {
//   return moslim_fr.map((hadith) => ({
//     id: hadith.id.toString(),
//   }));
// }
