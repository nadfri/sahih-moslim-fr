"use client";

import Link from "next/link";
import { Pencil, ScanEye, TriangleAlert } from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";
import { HadithType } from "@/src/types/types";
import { CopyBoard } from "../../CopyBoard/CopyBoard";

type Props = {
  hadith: HadithType;
  edit?: boolean;
};

export function ActionsBtns({ hadith, edit }: Props) {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "ADMIN";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
      {/* Preview badge shown only in edit mode */}
      {edit && (
        <span className="text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded inline-flex items-center gap-1">
          <ScanEye
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
          Aperçu
        </span>
      )}

      <div className="flex flex-wrap items-center gap-3 ml-auto">
        <CopyBoard hadith={hadith} />

        <button
          className="inline-flex items-center gap-1.5 text-sm font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-500 px-3 py-1.5 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/70 hover:text-amber-700 dark:hover:text-amber-400 transition-all duration-200"
          title="Signaler une erreur"
          aria-label="Signaler une erreur dans ce hadith"
        >
          <TriangleAlert
            className="h-4 w-4"
            aria-hidden="true"
          />
          <span>Signaler</span>
        </button>

        {isAdmin && (
          <Link
            href={`/hadiths/${hadith.numero}/edit`}
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-orange-50 dark:bg-orange-700 text-orange-600 dark:text-orange-300 px-3 py-1.5 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/70 hover:text-orange-700 dark:hover:text-orange-400 transition-all duration-200"
            title="Modifier ce hadith"
            aria-label="Éditer le hadith"
          >
            <Pencil
              className="h-4 w-4"
              aria-hidden="true"
            />
            <span>Éditer</span>
          </Link>
        )}
      </div>
    </div>
  );
}
