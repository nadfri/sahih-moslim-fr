/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllSahabas,
  getSahabaBySlug,
  getSahabaWithHadiths,
} from "@/src/services/services";
import { ListLayoutHadith } from "@/src/ui/hadith/ListLayoutHadith";

export type ParamsType = Promise<{ slug: string }>;

export default async function PageBySahabas(props: { params: ParamsType }) {
  const params = await props.params;
  const slug = params.slug;

  const { sahaba, hadiths } = await getSahabaWithHadiths(slug);

  if (!sahaba) {
    return notFound();
  }

  return (
    <ListLayoutHadith
      title="Hadiths mentionnant"
      name={sahaba.name}
      hadiths={hadiths}
    />
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
  const sahabas = await getAllSahabas();

  return sahabas.map((sahaba) => ({
    slug: sahaba.slug,
  }));
}
