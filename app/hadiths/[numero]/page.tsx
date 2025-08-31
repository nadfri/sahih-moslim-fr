/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHadithByNumero } from "@/src/services/services";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { getNarratorName } from "@/src/utils/getNarratorName";

export type ParamsType = Promise<{ numero: string }>;

export default async function PageByNumero({ params }: { params: ParamsType }) {
  const numero = (await params).numero;

  const hadith = await getHadithByNumero(numero);

  if (!hadith) {
    return notFound();
  }

  return (
    <>
      <h1 className="title">
        N°{numero} - {getNarratorName(hadith)}
      </h1>
      <Hadith hadith={hadith} />
    </>
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const numero = (await params).numero;

  const hadith = await getHadithByNumero(numero);

  if (!hadith) {
    return {
      title: "Hadith non trouvé",
    };
  }

  return {
    title: `N°${numero} - ${getNarratorName(hadith)}`,
    description: hadith.matn_fr.substring(0, 160) + "...",
  };
}

/*Generate static paths for all hadiths*/
// export async function generateStaticParams() {
//   return moslim_fr.map((hadith) => ({
//     id: hadith.id.toString(),
//   }));
// }
