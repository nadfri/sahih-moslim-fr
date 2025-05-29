/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllTransmitters,
  getTransmitterBySlug,
  getTransmitterWithHadiths,
} from "@/src/services/services";
import { ListLayoutHadith } from "@/src/ui/hadith/ListLayoutHadith/ListLayoutHadith";

export type ParamsType = Promise<{ slug: string }>;

export default async function PageByTransmitter(props: { params: ParamsType }) {
  const params = await props.params;
  const slug = params.slug;

  const { transmitter, hadiths } = await getTransmitterWithHadiths(slug);

  if (!transmitter) {
    return notFound();
  }

  return (
    <ListLayoutHadith
      title="Hadiths mentionnant"
      name={transmitter.name}
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

  const transmitter = await getTransmitterBySlug(slug);

  if (!transmitter) {
    return {
      title: "Transmetteur non trouvé",
      description: "Ce transmetteur n'existe pas.",
    };
  }

  return {
    title: `Transmetteur: ${transmitter.name}`,
    description: `Collection de hadiths du transmetteur ${transmitter.name} - Sahih Moslim`,
  };
}

/*Generate static paths for all hadiths*/
export async function generateStaticParams() {
  const transmitters = await getAllTransmitters();

  return transmitters.map((transmitter) => ({
    slug: transmitter.slug,
  }));
}
