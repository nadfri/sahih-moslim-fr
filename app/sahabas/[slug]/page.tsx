/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Hadith } from '../../ui/Hadith/Hadith';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getAllNarrators,
  getNarratorBySlug,
  getHadithByNarratorSlug,
} from '@/services/services';
import { NarratorSlugType } from '@/types/types';

export type ParamsType = Promise<{ slug: string }>;

export default async function PageBySahabas(props: { params: ParamsType }) {
  const params = await props.params;
  const slug = params.slug as NarratorSlugType;

  const narrator = getNarratorBySlug(slug);

  if (!narrator) {
    return notFound();
  }

  const hadiths = getHadithByNarratorSlug(slug);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Narrateur: {narrator.name}</h1>

      <div className='space-y-8'>
        {hadiths.map((hadith) => (
          <Hadith key={hadith.id} hadith={hadith} />
        ))}
      </div>
    </div>
  );
}

/*Generate metadata for each narrator*/
export async function generateMetadata(props: { params: ParamsType }): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug as NarratorSlugType;
  const narrator = getNarratorBySlug(slug);

  if (!narrator) {
    return {
      title: 'Narrateur non trouvé',
    };
  }

  return {
    title: `Narrateur: ${narrator.name}`,
    description: `Collection de hadiths rapportés par ${narrator.name} - Sahih Moslim`,
  };
}

/*Generate static paths for all narrators*/
export async function generateStaticParams() {
  const narrators = getAllNarrators();

  const slugs = narrators.map((narrator) => narrator.slug);

  return slugs.map((slug: string) => ({
    slug,
  }));
}
