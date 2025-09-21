/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllTransmitters } from "@/src/services/services";
import { FilteredListCard } from "@/src/ui/FilteredListCard/FilteredListCard";
import { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

export default async function TransmittersPage() {
  const transmitters = await getAllTransmitters();

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title">Hadiths mentionnant des transmetteurs</h1>

      <FilteredListCard
        variant="transmitters"
        items={transmitters}
      />
    </div>
  );
}

// Generate static metadata
export async function generateMetadata(): Promise<Metadata> {
  const title = "Les Transmetteurs dans Moslim";
  const description =
    "Découvrez les transmetteurs de hadiths dans la collection Sahih Moslim.";

  return {
    title,
    description,
  };
}
