import { Link } from "@/i18n/navigation";
import { SquareArrowOutUpRight } from "lucide-react";

import { ItemType } from "@/src/types/types";

export function ListOfSahabas({ sahabas }: { sahabas: ItemType[] }) {
  if (sahabas.length === 0) return null;

  return (
    <div className="">
      <div className="flex flex-wrap gap-2 mt-10">
        <span className="text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-1">
          Sahaba(s) mentionné(s)
        </span>

        {sahabas.map((sahaba) => (
          <Link
            key={sahaba.id}
            href={`/sahabas/${sahaba.slug}`}
            className="text-sm bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 px-2 py-1 rounded-md transition-colors duration-200 hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
          >
            {sahaba.name_fr}{" "}
            <SquareArrowOutUpRight className="inline size-3 align-middle" />
          </Link>
        ))}
      </div>
    </div>
  );
}
