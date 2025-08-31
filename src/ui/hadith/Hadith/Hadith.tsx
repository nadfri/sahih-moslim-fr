import { HadithType } from "@/src/types/types";
import { ActionsBtns } from "../ActionBtns/ActionsBtns";
import { ChapterName } from "../ChapterName/ChapterName";
import { Isnad } from "../Isnad/Isnad";
import { ListOfSahabas } from "../ListOfSahabas/ListOfSahabas";
import { Matn_ar } from "../Matn_ar/Matn_ar";
import { Matn_fr } from "../Matn_fr/Matn_fr";

export function Hadith({
  hadith,
  edit,
  highlight,
}: {
  hadith: HadithType;
  edit?: boolean;
  highlight?: string;
}) {
  return (
    <div
      key={hadith.id}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl border-l-4 md:border-l-8 border-emerald-600 dark:border-emerald-700"
    >
      <div className="p-3 md:p-6">
        {/* Metadata Section (Chapter, Numero) */}
        <div className="mb-5">
          <ChapterName hadith={hadith} />

          {/* Isnad */}
          <Isnad
            isnadTransmitters={hadith.isnadTransmitters}
            edit={edit}
          />
        </div>

        {/* Matn_fr */}
        <Matn_fr
          matn={hadith.matn_fr}
          highlight={highlight}
        />

        {/* Sahabas */}
        <ListOfSahabas sahabas={hadith.mentionedSahabas} />

        {/* Matn_ar */}
        <Matn_ar
          matn={hadith.matn_ar}
          highlight={highlight}
          edit={edit}
        />

        {/* Action buttons section */}
        <ActionsBtns
          hadith={hadith}
          edit={edit}
        />
      </div>
    </div>
  );
}
