"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";

import { HadithType } from "@/types/types";
import { slugify } from "@/utils/slugify";

export function Hadith({ hadith }: { hadith: HadithType }) {
  const [isArabicVisible, setIsArabicVisible] = useState(false);

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
        {/* Section Métadonnées (Chapitre, ID, Narrateur) */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-amber-700 tracking-wide uppercase">{hadith.chapter}</p>
            <span className="bg-emerald-600 text-white text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              {hadith.id}
            </span>
          </div>
          <p className="text-sm text-gray-600 ">
            Rapporté par{" "}
            <Link
              href={`/narrators/${slugify(hadith.narrator)}`}
              className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              {hadith.narrator}
            </Link>
          </p>
        </div>

        {/* Section Matn (Texte principal en Français) */}
        <div className="space-y-3 text-gray-700 leading-relaxed font-serif italic">
          <ReactMarkdown>{hadith.matn}</ReactMarkdown>
        </div>

        {/* Section Sahabas Mentionnés */}
        {hadith.sahabas && hadith.sahabas.length > 0 && (
          <div className="mt-5 pt-4 border-t border-emerald-100">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-emerald-700">Sahaba(s) mentionné(s) :</span>

              {hadith.sahabas.map((sahaba) => (
                <React.Fragment key={sahaba}>
                  <Link
                    href={`/sahabas/${slugify(sahaba)}`}
                    className="text-emerald-600 hover:text-emerald-900 px-2 py-1 rounded-md bg-emerald-100 border border-emerald-300 m-1 transition-colors duration-200 hover:bg-emerald-200"
                  >
                    {sahaba}
                  </Link>
                </React.Fragment>
              ))}
            </p>
          </div>
        )}

        {/* Section Arabe avec bouton de bascule et animation adaptative */}
        {hadith.arabic && (
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
              {isArabicVisible ? (
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
              <span>{isArabicVisible ? "Masquer la version arabe" : "Voir la version arabe"}</span>
            </button>

            <div
              id={arabicContentId}
              className={`
                grid                      
                transition-[grid-template-rows,opacity]
                duration-500             
                ease-in-out              
                ${isArabicVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
              `}
            >
              <div className="overflow-hidden">
                <div
                  className="pt-2 text-right font-arabic text-xl leading-loose"
                  dir="rtl"
                >
                  {hadith.arabic}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
