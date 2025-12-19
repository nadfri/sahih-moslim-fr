import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllChapters,
  getAllSahabas,
  getAllTransmitters,
  getHadithByNumero,
} from "@/src/services/services";
import { enforceAdminAccess } from "@/src/lib/auth/supabase/helpers";
import { EditHadithForm } from "@/src/ui/forms/hadith-forms/EditHadithForm";

export const metadata: Metadata = {
  title: "Modifier un hadith",
  description: "Modifiez un hadith existant dans la base de données.",
};

type ParamsPromise = Promise<{ numero: string }>;

export default async function EditPage({ params }: { params: ParamsPromise }) {
  // Enforce admin access at page level
  await enforceAdminAccess();

  const resolvedParams = await params;
  const numero = resolvedParams.numero;

  const [hadith, chaptersData, sahabasData, transmittersData] =
    await Promise.all([
      getHadithByNumero(numero),
      getAllChapters(),
      getAllSahabas(),
      getAllTransmitters(),
    ]);

  if (!hadith) {
    notFound();
  }

  return (
    <>
      <h1 className="title">
        Modifier le hadith{" "}
        <span className="text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
          {hadith.numero}
        </span>
      </h1>

      <EditHadithForm
        hadith={hadith}
        chaptersData={chaptersData}
        sahabasData={sahabasData}
        transmittersData={transmittersData}
      />
    </>
  );
}
