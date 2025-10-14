import { HadithType } from "@/src/types/types";
import { ActionsBtns } from "../ActionBtns/ActionsBtns";
import { ChapterName } from "../ChapterName/ChapterName";
import { Isnad } from "../Isnad/Isnad";
import { ListOfSahabas } from "../ListOfSahabas/ListOfSahabas";
import { Matn_ar } from "../matns/Matn_ar/Matn_ar";
import { LocalizedMatn } from "../matns/LocalizedMatn/LocalizedMatn";
import { Preview } from "../Preview";
import { useLocale } from "next-intl";

type HadithProps = {
  hadith: HadithType;
  isAdmin?: boolean;
  edit?: boolean;
  highlight?: string;
};

export function Hadith({
  hadith,
  edit,
  highlight,
  isAdmin = false,
}: HadithProps) {
  const locale = useLocale();

  return (
    <div
      key={hadith.id}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-shadow duration-200 hover:shadow-xl border-l-4 md:border-l-8 border-emerald-600 dark:border-emerald-700"
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

        {/* Matn */}

        <LocalizedMatn
          hadith={hadith}
          highlight={highlight}
          edit={edit}
        />

        {/* Sahabas */}
        <ListOfSahabas sahabas={hadith.mentionedSahabas} />

        {/* Matn_ar */}
        {locale !== "ar" && (
          <Matn_ar
            matn={hadith.matn_ar}
            highlight={highlight}
            edit={edit}
          />
        )}

        {/* Action buttons section */}
        {edit ? (
          <Preview />
        ) : (
          <ActionsBtns
            hadith={hadith}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
}
