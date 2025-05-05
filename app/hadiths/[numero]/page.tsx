/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHadithByNumero } from "@/src/services/services";
import { Hadith } from "../../../src/ui/hadith/Hadith/Hadith";

export type ParamsType = Promise<{ numero: string }>;

export default async function PageByNumero({ params }: { params: ParamsType }) {
  const numero = (await params).numero;

  const hadith = await getHadithByNumero(numero);

  if (!hadith) {
    return notFound();
  }

  return (
    <>
      <h1 className="text-2xl md:text-4xl font-serif font-bold text-center text-emerald-800 mb-8 md:mb-12 tracking-tight">
        N°{numero} - {hadith.narrator.name}
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
    title: `N°${numero} - ${hadith.narrator.name}`,
    description: hadith.matn_fr.substring(0, 160) + "...",
  };
}

/*Generate static paths for all hadiths*/
// export async function generateStaticParams() {
//   return moslim_fr.map((hadith) => ({
//     id: hadith.id.toString(),
//   }));
// }
