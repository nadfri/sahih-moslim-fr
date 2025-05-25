import Link from "next/link";

import { HadithType } from "@/src/types/types";
import { escapeRegExp } from "@/src/utils/escapeRegExp";

export function ListOfSahabas({
  hadith,
  highlight,
}: {
  hadith: HadithType;
  highlight?: string;
}) {
  // Build case-insensitive regex for highlighting if a query is provided
  const highlightRegex = highlight
    ? new RegExp(`(${escapeRegExp(highlight)})`, "gi")
    : null;

  // Split text and wrap matched parts in a <mark> for highlighting
  const highlightParts = (text: string): (string | React.ReactNode)[] =>
    highlightRegex
      ? text.split(highlightRegex).map((part, i) =>
          highlightRegex.test(part) ? (
            <mark
              key={i}
              className="bg-yellow-200"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )
      : [text];

  if (hadith.mentionedSahabas?.length === 0) return null;

  return (
    <div className="mt-5 pt-4 border-t border-emerald-100 dark:border-emerald-900">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-semibold text-emerald-700 dark:text-emerald-500">
          Sahaba(s) mentionné(s) :
        </span>
      </p>

      <div className="flex flex-wrap gap-x-2 gap-y-2 mt-2">
        {hadith.mentionedSahabas.map((sahaba) => (
          <Link
            key={sahaba.id}
            href={`/sahabas/${sahaba.slug}`}
            className="text-sm bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 px-2 py-1 rounded-md transition-colors duration-200 hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
          >
            {highlight ? highlightParts(sahaba.name) : sahaba.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
