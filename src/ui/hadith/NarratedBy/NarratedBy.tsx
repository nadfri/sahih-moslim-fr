import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";

import { ItemType } from "@/src/types/types";
import { TextHighlighter } from "@/src/utils/TextHighlighter";

export function NarratedBy({
  narrator,
  highlight,
}: {
  narrator: ItemType;
  highlight?: string;
}) {
  return (
    <p className="text-sm text-gray-600 dark:text-gray-400">
      D' après{" "}
      <Link
        href={`/narrators/${narrator.slug}`}
        className="font-medium text-emerald-700 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400 hover:underline transition-colors duration-200"
      >
        <TextHighlighter
          text={narrator.name}
          highlight={highlight}
          as="span"
        />{" "}
        <SquareArrowOutUpRight className="inline size-3 align-middle" />
      </Link>
    </p>
  );
}
