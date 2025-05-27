/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import {
  getAllChapters,
  getAllNarrators,
  getAllSahabas,
  getAllTransmitters,
} from "@/src/services/services";
import { AdminDashboard } from "@/src/ui/admin/AdminDashboard/AdminDashboard";

export default async function AdminPage() {
  const [chapters, narrators, sahabas, transmitters] = await Promise.all([
    getAllChapters(),
    getAllNarrators(),
    getAllSahabas(),
    getAllTransmitters(),
  ]);

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title mb-10 text-center">Administration</h1>

      <AdminDashboard
        chapters={chapters}
        narrators={narrators}
        sahabas={sahabas}
        transmitters={transmitters}
      />
    </div>
  );
}
