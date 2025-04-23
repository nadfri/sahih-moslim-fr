/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllSahabas,
  getHadithBySahabaSlug,
  getSahabaBySlug,
} from "@/src/services/services";
import { slugify } from "@/src/utils/slugify";
import { Hadith } from "@/ui/hadith/Hadith";

export type ParamsType = Promise<{ slug: string }>;

export default async function PageBySahabas(props: { params: ParamsType }) {
  const params = await props.params;
  const slug = params.slug;

  const sahaba = getSahabaBySlug(slug);

  if (!sahaba) {
    return notFound();
  }

  const hadiths = getHadithBySahabaSlug(slug);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-center text-emerald-800 mb-8 md:mb-12 tracking-tight">
        Hadiths mentionnant {sahaba}
      </h1>

      <p className="text-lg mb-4">Nombre de hadiths: {hadiths.length}</p>

      <div className="space-y-8">
        {hadiths.map((hadith) => (
          <Hadith
            key={hadith.id}
            hadith={hadith}
          />
        ))}
      </div>
    </div>
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata(props: {
  params: ParamsType;
}): Promise<Metadata> {
  const params = await props.params;

  const slug = params.slug;

  const sahaba = getSahabaBySlug(slug);

  if (!sahaba) {
    return {
      title: "Compagon non trouvé",
    };
  }

  return {
    title: `Compagnon: ${sahaba}`,
    description: `Collection de hadiths du compagnon ${sahaba} - Sahih Moslim`,
  };
}

/*Generate static paths for all hadiths*/
export async function generateStaticParams() {
  const sahabas = getAllSahabas();

  return sahabas.map((sahaba: string) => ({
    slug: slugify(sahaba),
  }));
}
