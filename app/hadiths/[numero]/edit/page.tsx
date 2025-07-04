import { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  getAllChapters,
  getAllNarrators,
  getAllSahabas,
  getAllTransmitters,
  getHadithByNumero,
  getHadithNumeros,
} from "@/src/services/services";
import { EditHadithForm } from "@/src/ui/forms/EditHadithForm";

export const metadata: Metadata = {
  title: "Modifier un hadith",
  description: "Modifiez un hadith existant dans la base de données.",
};

type Params = Promise<{ numero: string }>;

export default async function EditPage(props: { params: Params }) {
  const params = await props.params;
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }
  const numero = params.numero;
  const [
    hadith,
    existingNumeros,
    chaptersData,
    narratorsData,
    sahabasData,
    transmittersData,
  ] = await Promise.all([
    getHadithByNumero(numero),
    getHadithNumeros(),
    getAllChapters(),
    getAllNarrators(),
    getAllSahabas(),
    getAllTransmitters(),
  ]);

  if (!hadith) {
    redirect("/hadiths");
  }

  const otherNumeros = existingNumeros.filter((n) => n !== hadith.numero);

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
        existingNumeros={otherNumeros}
        chaptersData={chaptersData}
        narratorsData={narratorsData}
        sahabasData={sahabasData}
        transmittersData={transmittersData}
      />
    </>
  );
}
