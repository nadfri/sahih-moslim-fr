import Link from "next/link";

import { HadithType } from "@/src/types/types";
import { ArabicIcon } from "@/src/ui/icons/ArabicIcon";
import { ActionsBtns } from "../ActionBtns/ActionsBtns";
import { ListOfSahabas } from "../ListOfSahabas/ListOfSahabas";
import { Matn_ar } from "../Matn_ar/Matn_ar";
import { Matn_fr } from "../Matn_fr/Matn_fr";

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
          <div className="flex items-center justify-between mb-2">
            <Link
              href={`/chapters/${hadith.chapter.slug}`}
              className="text-sm font-medium text-amber-700 dark:text-amber-500 tracking-wide uppercase inline-flex items-center hover:text-amber-900 dark:hover:text-amber-400 hover:underline transition-colors duration-200"
            >
              <ArabicIcon className="mr-1 h-5" /> {hadith.chapter.name}
            </Link>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 dark:bg-emerald-700 text-white text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                {hadith.numero}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Rapporté par{" "}
            <Link
              href={`/narrators/${hadith.narrator.slug}`}
              className="font-medium text-emerald-700 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400 hover:underline transition-colors duration-200"
            >
              {hadith.narrator.name}
            </Link>
          </p>
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
