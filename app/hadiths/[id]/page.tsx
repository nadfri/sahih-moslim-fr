/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHadithById } from "@/src/services/services";
import { Hadith } from "../../../src/ui/hadith/Hadith";

export type ParamsType = Promise<{ id: string }>;

export default async function PageById({ params }: { params: ParamsType }) {
  const id = Number((await params).id);

  const hadith = getHadithById(id);

  if (!hadith) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-center text-emerald-800 mb-8 md:mb-12 tracking-tight">
        N°{id} - {hadith.narrator}
      </h1>
      <Hadith hadith={hadith} />
    </div>
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const id = Number((await params).id);

  const hadith = getHadithById(id);

  if (!hadith) {
    return {
      title: "Hadith non trouvé",
    };
  }

  return {
    title: `N°${id} - ${hadith.narrator}`,
    description: hadith.matn_fr.substring(0, 160) + "...",
  };
}

/*Generate static paths for all hadiths*/
// export async function generateStaticParams() {
//   return moslim_fr.map((hadith) => ({
//     id: hadith.id.toString(),
//   }));
// }
