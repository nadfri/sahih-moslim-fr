import { HadithType } from "@/src/types/types";
import { ActionsBtns } from "../ActionBtns/ActionsBtns";
import { ChapterName } from "../ChapterName/ChapterName";
import { Isnad } from "../Isnad/Isnad";
import { ListOfSahabas } from "../ListOfSahabas/ListOfSahabas";
import { Matn_ar } from "../Matn_ar/Matn_ar";
import { Matn_fr } from "../Matn_fr/Matn_fr";
import { NarratedBy } from "../NarratedBy/NarratedBy";

export function Hadith({
  hadith,
  update,
  highlight,
}: {
  hadith: HadithType;
  update?: boolean;
  highlight?: string;
}) {
  return (
    <div
      key={hadith.id}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl border-l-4 md:border-l-8 border-emerald-600 dark:border-emerald-700"
    >
      <div className="p-3 md:p-6">
        {/* Metadata Section (Chapter, ID, Narrator) */}
        <div className="mb-5">
          <ChapterName hadith={hadith} />

          {/* Narrator Section */}
          <NarratedBy
            narrator={hadith.narrator}
            highlight={highlight}
          />

          {/* Isnad */}
          <Isnad
            isnadTransmitters={hadith.isnadTransmitters}
            highlight={highlight}
          />
        </div>

        {/* matn_fr Section (Main text in French) */}
        <Matn_fr
          matn={hadith.matn_fr}
          highlight={highlight}
        />

        {/* Mentioned Sahabas Section */}
        <ListOfSahabas
          sahabas={hadith.mentionedSahabas}
          highlight={highlight}
        />

        {/* matn_ar Section with toggle button and adaptive animation */}
        <Matn_ar
          matn={hadith.matn_ar}
          highlight={highlight}
          update={update}
        />

        {/* Action buttons section */}
        <ActionsBtns
          hadith={hadith}
          update={update}
        />
      </div>
    </div>
  );
}
