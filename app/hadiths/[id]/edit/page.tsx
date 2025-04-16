/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getHadithById } from "@/src/services/services";
import { EditHadithForm } from "@/src/ui/hadith/EditHadithForm";

export type ParamsType = Promise<{ id: string }>;

export default async function EditHadithPage({
  params,
}: {
  params: ParamsType;
}) {
  // Check if we are in production and redirect if true
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }

  const id = Number((await params).id);

  const hadith = getHadithById(id);

  if (!hadith) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-emerald-700 mb-8">
        Modifier le hadith #{id}
      </h1>
      <EditHadithForm hadith={hadith} />
    </div>
  );
}

/*Generate metadata for each hadith*/
export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const id = Number((await params).id);

  const hadith = getHadithById(id);

  if (!hadith) {
    return {
      title: "Hadith non trouvé",
    };
  }

  return {
    title: `N°${id} - ${hadith.narrator}`,
    description: hadith.matn.substring(0, 160) + "...",
  };
}
