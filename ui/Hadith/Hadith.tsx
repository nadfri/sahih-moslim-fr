"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";

import { HadithType } from "@/types/types";
import { slugify } from "@/utils/slugify";
import ArabicIcon from "../icons/ArabicIcon";

export function Hadith({
  hadith,
  update,
}: {
  hadith: HadithType;
  update?: boolean;
}) {
  const [isArabicVisible, setIsArabicVisible] = useState(false);
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  const toggleArabicVisibility = () => {
    setIsArabicVisible(!isArabicVisible);
  };

  const arabicContentId = `arabic-content-${hadith.id}`;

  return (
    <div
      key={hadith.id}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl border-l-8 border-emerald-600"
    >
      <div className="p-6 sm:p-4">
        {/* Metadata Section (Chapter, ID, Narrator) */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <Link
              href={`/chapters/${slugify(hadith.chapter)}`}
              className="text-sm font-medium text-amber-700 tracking-wide uppercase inline-flex items-center hover:text-amber-900 hover:underline transition-colors duration-200"
            >
              <ArabicIcon className="mr-1 h-5" /> {hadith.chapter}
            </Link>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                {hadith.id}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 ">
            Rapporté par{" "}
            <Link
              href={`/narrators/${slugify(hadith.narrator)}`}
              className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline transition-colors duration-200"
            >
              {hadith.narrator}
            </Link>
          </p>
        </div>

        {/* Matn Section (Main text in French) */}
        <div className="space-y-3 text-gray-700 leading-relaxed text-pretty">
          <ReactMarkdown>{hadith.matn}</ReactMarkdown>
        </div>

        {/* Mentioned Sahabas Section */}
        {hadith.sahabas && hadith.sahabas.length > 0 && (
          <div className="mt-5 pt-4 border-t border-emerald-100">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-emerald-700">
                Sahaba(s) mentionné(s) :
              </span>
            </p>

            <div className="flex flex-wrap gap-x-2 gap-y-2 mt-2">
              {hadith.sahabas.map((sahaba) => (
                <Link
                  key={sahaba}
                  href={`/sahabas/${slugify(sahaba)}`}
                  className="text-sm bg-emerald-50 text-emerald-700 hover:text-emerald-900 px-2 py-1 rounded-md transition-colors duration-200 hover:bg-emerald-200"
                >
                  {sahaba}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Arabic Section with toggle button and adaptive animation */}
        <div className="mt-5 pt-4 border-t border-emerald-100">
          <button
            onClick={toggleArabicVisibility}
            className="flex items-center space-x-2 
                text-sm font-medium 
                text-emerald-700 hover:text-emerald-900 
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 
                rounded mb-3 
                transition-colors duration-200"
            aria-expanded={isArabicVisible}
            aria-controls={arabicContentId}
          >
            {isArabicVisible || update ? (
              <EyeSlashIcon
                className="w-5 h-5"
                aria-hidden="true"
              />
            ) : (
              <EyeIcon
                className="w-5 h-5"
                aria-hidden="true"
              />
            )}
            <span>
              {isArabicVisible || update
                ? "Masquer la version arabe"
                : "Voir la version arabe"}
            </span>
          </button>

          <div
            id={arabicContentId}
            className={`
                grid                      
                transition-[grid-template-rows,opacity]
                duration-500             
                ease-in-out              
                ${isArabicVisible || update ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
              `}
          >
            <div className="overflow-hidden">
              <div
                className="pt-2 text-right font-arabic text-xl leading-loose text-pretty"
                dir="rtl"
              >
                {hadith.arabic}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons section */}
        <div className="flex flex-wrap items-center gap-3 justify-end">
          <button
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-md hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200"
            title="Copier le hadith"
            aria-label="Copier le contenu du hadith"
          >
            <ClipboardDocumentIcon
              className="h-4 w-4"
              aria-hidden="true"
            />
            <span>Copier</span>
          </button>

          <button
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-amber-50 text-amber-600 px-3 py-1.5 rounded-md hover:bg-amber-100 hover:text-amber-700 transition-all duration-200"
            title="Signaler une erreur"
            aria-label="Signaler une erreur dans ce hadith"
          >
            <ExclamationTriangleIcon
              className="h-4 w-4"
              aria-hidden="true"
            />
            <span>Signaler</span>
          </button>

          {isDevelopment && (
            <Link
              href={`/hadiths/${hadith.id}/edit`}
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-orange-50 text-orange-600 px-3 py-1.5 rounded-md hover:bg-orange-100 hover:text-orange-700 transition-all duration-200"
              title="Modifier ce hadith"
              aria-label="Éditer le hadith"
            >
              <PencilIcon
                className="h-4 w-4"
                aria-hidden="true"
              />
              <span>Éditer</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
