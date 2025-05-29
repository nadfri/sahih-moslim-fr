import Link from "next/link";
import { ChevronRightCircle, SquareArrowOutUpRight } from "lucide-react";

import { ItemType } from "@/src/types/types";
import { highlightText } from "@/src/utils/highlightText";

type Props = {
  isnadTransmitters: ItemType[];
  highlight?: string;
};

export function Isnad({ isnadTransmitters, highlight }: Props) {
  if (!isnadTransmitters || isnadTransmitters.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-2 items-center w-fit">
      <span className="text-xs font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-1">
        Isnad
      </span>

      {isnadTransmitters.map((trans, index) => (
        <div
          key={trans.id}
          className="flex items-center"
        >
          <Link
            href={`/transmitters/${trans.slug}`}
            className="text-xs bg-emerald-100 dark:bg-emerald-900/70 text-emerald-900 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-300 px-1.5 py-1 rounded-md transition-colors duration-200 hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
          >
            {highlightText(trans.name, highlight)}{" "}
            <SquareArrowOutUpRight className="inline size-2.5 align-middle" />
          </Link>

          {index < isnadTransmitters.length - 1 && (
            <ChevronRightCircle className="ml-1 size-4 text-gray-500 dark:text-gray-400" />
          )}
        </div>
      ))}
    </div>
  );
}
