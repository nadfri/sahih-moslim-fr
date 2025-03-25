/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { moslim_fr } from '@/db/fr';
import { Hadith } from '../ui/Hadith/Hadith';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export type ParamsType = Promise<{ id: string }>;

/*Generate metadata for each hadith*/
export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const id = Number((await params).id);

  const hadith = moslim_fr.find((hadith) => hadith.id === id);

  if (!hadith) {
    return {
      title: 'Hadith non trouvé',
    };
  }

  return {
    title: `N°${id} - ${hadith.narrator}`,
    description: hadith.text.substring(0, 160) + '...',
  };
}
export default async function PageById({ params }: { params: ParamsType }) {
  const id = Number((await params).id);

  const hadith = moslim_fr.find((hadith) => hadith.id === id);

  if (!hadith) {
    return notFound();
  }

  return (
    <div>
      <h1>N°{id} - {hadith.narrator}</h1>
      <Hadith hadith={hadith} />
    </div>
  );
}

/*Generate static paths for all hadiths*/
export async function generateStaticParams() {
  return moslim_fr.map((hadith) => ({
    id: hadith.id.toString(),
  }));
}
