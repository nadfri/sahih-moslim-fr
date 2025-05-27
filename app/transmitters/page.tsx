/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { getAllTransmitters } from "@/src/services/services";
import { FilteredListCard } from "@/src/ui/FilteredListCard/FilteredListCard";

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
