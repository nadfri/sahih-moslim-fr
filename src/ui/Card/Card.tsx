import { Link } from "@/i18n/navigation";
import { BookOpenText, MoveRight } from "lucide-react";

import { ItemType, VariantType } from "@/src/types/types";
import { ChapterIndex } from "@/src/ui/Card/ChapterIndex/ChapterIndex";

type Props = {
  item: ItemType;
  variant: VariantType;
};

export function Card({ item, variant }: Props) {
  return (
    <Link
      href={`/${variant}/${item.slug}`}
      key={item.name_fr}
      className="group block h-full"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col p-3 transition-all duration-200 ease-in-out border border-transparent group-hover:shadow-xl group-hover:border-emerald-300 dark:group-hover:border-emerald-700 group-hover:-translate-y-1">
        {/* Main card content */}
        <div className="flex-grow">
          {/* Styled chapter number */}
          <ChapterIndex index={item.index} />

          {/* Chapter Name */}
          <h2 className="text-xl font-semibold font-serif text-emerald-700 dark:text-emerald-500 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {item.name_fr}
          </h2>

          <p className="text-xs inline-flex items-center font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md px-2 py-0.5">
            <BookOpenText className="h-3 w-3 me-1" />
            {item.hadithCount} Hadiths
          </p>
        </div>

        {/* Navigation indicator (appears more clearly on hover) */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500 flex items-center group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            Explorer
            <MoveRight className="h-4 w-4 ms-1 transition-transform group-hover:translate-x-1" />
          </p>
        </div>
      </div>
    </Link>
  );
}
