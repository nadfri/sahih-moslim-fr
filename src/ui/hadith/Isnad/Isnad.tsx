"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  ChevronRightCircle,
  Eye,
  EyeOff,
  SquareArrowOutUpRight,
} from "lucide-react";

import { ItemType } from "@/src/types/types";
import { highlightText } from "@/src/utils/highlightText";

type Props = {
  isnadTransmitters: ItemType[];
  highlight?: string;
  update?: boolean;
};

export function Isnad({ isnadTransmitters, highlight, update }: Props) {
  const [isIsnadVisible, setIsIsnadVisible] = useState(update ?? false);
  const isnadContentId = useId();

  const toggleIsnadVisibility = () => {
    setIsIsnadVisible(!isIsnadVisible);
  };

  if (!isnadTransmitters || isnadTransmitters.length === 0) return null;

  const baseLinkClasses =
    "text-xs px-1.5 py-1 rounded-md transition-colors duration-200 shrink-0";
  const regularTransmitterClasses =
    "bg-emerald-100 dark:bg-emerald-900/70 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/50";
  const lastTransmitterClasses =
    "bg-sky-100 dark:bg-sky-900/70 text-sky-900 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800/50";

  return (
    <div className="flex flex-wrap gap-x-1 gap-y-2 mt-2 items-center w-fit">
      <button
        onClick={toggleIsnadVisibility}
        className="flex items-center space-x-1 text-xs font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 focus:outline-none shrink-0"
        aria-expanded={isIsnadVisible}
        aria-controls={isnadContentId}
      >
        {isIsnadVisible ? (
          <EyeOff
            className="size-4"
            aria-hidden="true"
          />
        ) : (
          <Eye
            className="size-4"
            aria-hidden="true"
          />
        )}

        <span>{isIsnadVisible ? "Masquer Isnad" : "Voir Isnad"}</span>
      </button>
      <div className="basis-full md:hidden" />
      {isIsnadVisible &&
        isnadTransmitters.map((trans, index) => {
          const isLast = index === isnadTransmitters.length - 1;
          const linkClassName = `${baseLinkClasses} ${isLast ? lastTransmitterClasses : regularTransmitterClasses}`;

          return (
            <div
              key={trans.id}
              className="flex items-center fadeIn"
            >
              <ChevronRightCircle className="size-4 text-gray-500 dark:text-gray-300 mr-1" />

              <Link
                href={`/transmitters/${trans.slug}`}
                className={linkClassName}
              >
                {highlightText(trans.name, highlight)}{" "}
                <SquareArrowOutUpRight className="inline size-2.5 align-middle" />
              </Link>
            </div>
          );
        })}
    </div>
  );
}
