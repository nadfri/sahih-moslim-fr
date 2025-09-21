/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import {
  getAllChapters,
  getAllSahabas,
  getAllTransmitters,
  getHadithsCount,
} from "@/src/services/services";
import { AdminDashboard } from "@/app/[locale]/admin/AdminDashboard/AdminDashboard";
import { ItemType } from "@/src/types/types";

export type DatasType = {
  chapters: ItemType[];
  sahabas: ItemType[];
  transmitters: ItemType[];
  hadithsCount: number;
};

export default async function AdminPage() {
  const [chapters, sahabas, transmitters, hadithsCount] = await Promise.all([
    getAllChapters(),
    getAllSahabas(),
    getAllTransmitters(),
    getHadithsCount(),
  ]);

  const datas = {
    chapters,
    sahabas,
    transmitters,
    hadithsCount,
  } as DatasType;

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="title mb-10 text-center">Administration</h1>

      <AdminDashboard datas={datas} />
    </div>
  );
}
