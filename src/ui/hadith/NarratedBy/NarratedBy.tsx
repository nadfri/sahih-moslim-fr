import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";

import { ItemType } from "@/src/types/types";

export function NarratedBy({ narrator }: { narrator: ItemType }) {
  return (
    <p className="text-sm text-gray-600 dark:text-gray-400">
      D' après{" "}
      <Link
        href={`/transmitters/${narrator.slug}`}
        className="font-medium text-emerald-700 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400 hover:underline transition-colors duration-200"
      >
        {narrator.name_fr}{" "}
        <SquareArrowOutUpRight className="inline size-3 align-middle" />
      </Link>
    </p>
  );
}
