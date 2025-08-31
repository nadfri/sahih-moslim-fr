/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import {
  getAllChapters,
  getAllSahabas,
  getAllTransmitters,
} from "@/src/services/services";
import { AdminDashboard } from "@/src/ui/admin/AdminDashboard/AdminDashboard";

export default async function AdminPage() {
  const [chapters, sahabas, transmitters] = await Promise.all([
    getAllChapters(),
    getAllSahabas(),
    getAllTransmitters(),
  ]);

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title mb-10 text-center">Administration</h1>

      <AdminDashboard
        chapters={chapters}
        sahabas={sahabas}
        transmitters={transmitters}
      />
    </div>
  );
}
