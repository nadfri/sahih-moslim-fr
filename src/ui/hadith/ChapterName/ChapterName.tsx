import Link from "next/link";

import { HadithType } from "@/src/types/types";
import { ArabicIcon } from "../../icons/ArabicIcon";

export function ChapterName({ hadith }: { hadith: HadithType }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <Link
        href={`/chapters/${hadith.chapter.slug}`}
        className="text-sm font-medium text-amber-700 dark:text-amber-500 tracking-wide uppercase inline-flex items-center hover:text-amber-900 dark:hover:text-amber-400 hover:underline transition-colors duration-200"
      >
        <ArabicIcon className="mr-1 h-5" /> {hadith.chapter.name_fr}
      </Link>

      <div className="flex items-center gap-2">
        <span className="bg-emerald-600 dark:bg-emerald-700 text-white text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
          {hadith.numero}
        </span>
      </div>
    </div>
  );
}
