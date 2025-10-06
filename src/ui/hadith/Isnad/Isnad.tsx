"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  ChevronRightCircle,
  Eye,
  EyeOff,
  SquareArrowOutUpRight,
} from "lucide-react";

import { ItemType } from "@/src/types/types";
import { NarratedBy } from "../NarratedBy/NarratedBy";
import { useTranslations } from "next-intl";

type Props = {
  isnadTransmitters: ItemType[];
  edit?: boolean;
};

export function Isnad({ isnadTransmitters, edit }: Props) {
  const t = useTranslations("hadith.ActionsBtns");

  const [isIsnadVisible, setIsIsnadVisible] = useState(edit ?? false);
  // Use a stable id based on the last transmitter (narrator)
  const isnadContentId = `isnad-${isnadTransmitters[isnadTransmitters.length - 1]?.id ?? "unknown"}`;

  const toggleIsnadVisibility = () => {
    setIsIsnadVisible(!isIsnadVisible);
  };

  if (!isnadTransmitters || isnadTransmitters.length === 0) return null;

  // Le premier transmetteur est le "narrator"
  const narrator = isnadTransmitters[isnadTransmitters.length - 1];

  const baseLinkClasses =
    "text-xs px-1.5 py-1 rounded-md transition-colors duration-200 shrink-0";
  const regularTransmitterClasses =
    "bg-emerald-100 dark:bg-emerald-900/70 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/50";
  const lastTransmitterClasses =
    "bg-sky-100 dark:bg-sky-900/70 text-sky-900 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800/50";

  return (
    <div className="flex flex-wrap gap-x-1 gap-y-2 mt-2 items-center w-fit">
      {!isIsnadVisible ? (
        <>
          <NarratedBy narrator={narrator} />
          <div className="w-full md:w-auto">
            <button
              onClick={toggleIsnadVisibility}
              className="flex items-center space-x-1 text-xs font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 focus:outline-none shrink-0 md:ms-2 ms-0"
              aria-expanded={isIsnadVisible}
              aria-controls={isnadContentId}
            >
              <Eye
                className="size-4"
                aria-hidden="true"
              />
              <span>{t("see-isnad")}</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={toggleIsnadVisibility}
            className="flex items-center space-x-1 text-xs font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 focus:outline-none shrink-0"
            aria-expanded={isIsnadVisible}
            aria-controls={isnadContentId}
          >
            <EyeOff
              className="size-4"
              aria-hidden="true"
            />
            <span>{t("hide-isnad")}</span>
          </button>
          <div className="basis-full md:hidden" />
          {isnadTransmitters.map((transmitter, index) => {
            const isLast = index === isnadTransmitters.length - 1;
            const linkClassName = `${baseLinkClasses} ${isLast ? lastTransmitterClasses : regularTransmitterClasses}`;

            return (
              <div
                key={transmitter.id}
                className="flex items-center fadeIn"
              >
                <ChevronRightCircle className="size-4 text-gray-500 dark:text-gray-300 me-1" />

                <Link
                  href={`/transmitters/${transmitter.slug}`}
                  className={linkClassName}
                >
                  {transmitter.name_fr}{" "}
                  <SquareArrowOutUpRight className="inline size-2.5 align-middle" />
                </Link>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
