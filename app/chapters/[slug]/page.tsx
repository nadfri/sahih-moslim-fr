/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Hadith } from '../../ui/Hadith/Hadith';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getAllChapters,
  getChapterBySlug,
  getHadithByChapterSlug,
} from '@/services/services';
import { ChapterSlugType } from '@/types/types';

export type ParamsType = Promise<{ slug: string }>;

export default async function PageByChapters(props: { params: ParamsType }) {
  const params = await props.params;
  const slug = params.slug as ChapterSlugType;

  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    return notFound();
  }

  const hadiths = getHadithByChapterSlug(slug);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Chapitre: {chapter.title}</h1>

      <div className='space-y-8'>
        {hadiths.map((hadith) => (
          <Hadith key={hadith.id} hadith={hadith} />
        ))}
      </div>
    </div>
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata(props: { params: ParamsType }): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug as ChapterSlugType;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    return {
      title: 'Chapitre non trouvé',
    };
  }

  return {
    title: `Chapitre: ${chapter.title}`,
    description: `Collection de hadiths du chapitre ${chapter.title} - Sahih Moslim`,
  };
}

/*Generate static paths for all hadiths*/
export async function generateStaticParams() {
  const chapters = getAllChapters();

  const slugs = chapters.map((chapter) => chapter.slug);

  return slugs.map((slug: string) => ({
    slug,
  }));
}
