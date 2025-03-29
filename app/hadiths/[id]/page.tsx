/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { moslim_fr } from "@/db/moslim_fr";
import { getHadithById } from "@/services/services";
import { Hadith } from "../../../ui/Hadith/Hadith";

export type ParamsType = Promise<{ id: string }>;

export default async function PageById({ params }: { params: ParamsType }) {
  const id = Number((await params).id);

  const hadith = getHadithById(id);

  if (!hadith) {
    return notFound();
  }

  return (
    <div>
      <h1>
        N°{id} - {hadith.narrator}
      </h1>
      <Hadith hadith={hadith} />
    </div>
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata({ params }: { params: ParamsType }): Promise<Metadata> {
  const id = Number((await params).id);

  const hadith = getHadithById(id);

  if (!hadith) {
    return {
      title: "Hadith non trouvé",
    };
  }

  return {
    title: `N°${id} - ${hadith.narrator}`,
    description: hadith.matn.substring(0, 160) + "...",
  };
}

/*Generate static paths for all hadiths*/
export async function generateStaticParams() {
  return moslim_fr.map((hadith) => ({
    id: hadith.id.toString(),
  }));
}
