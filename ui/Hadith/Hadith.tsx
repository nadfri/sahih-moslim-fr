"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { HadithType } from "@/types/types";

// Icône SVG simple pour l'œil (vous pouvez utiliser une bibliothèque comme Heroicons si préféré)
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

type HadithProps = {
  hadith: HadithType;
};

export function Hadith({ hadith }: HadithProps) {
  const [isArabicVisible, setIsArabicVisible] = useState(false);

  const toggleArabicVisibility = () => {
    setIsArabicVisible(!isArabicVisible);
  };

  // ID unique pour lier le bouton au contenu (accessibilité)
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
            Rapporté par <span className="font-medium text-emerald-700">{hadith.narrator}</span>
          </p>
        </div>

        {/* Section Matn (Texte principal en Français) */}
        <div className="space-y-3 text-gray-700 leading-relaxed font-serif italic">
          {/* Utilisez ReactMarkdown ou affichez simplement le texte si c'est du simple texte */}
          <ReactMarkdown>{hadith.matn}</ReactMarkdown>
        </div>

        {/* Section Sahabas Mentionnés */}
        {hadith.sahabas && hadith.sahabas.length > 0 && (
          <div className="mt-5 pt-4 border-t border-emerald-100">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-emerald-700">Sahaba(s) mentionné(s) :</span>{" "}
              {hadith.sahabas.join(", ")}
            </p>
          </div>
        )}

        {/* Section Arabe avec bouton de bascule et animation adaptative */}
        {hadith.arabic && (
          <div className="mt-5 pt-4 border-t border-emerald-100">
            {/* Bouton pour afficher/masquer */}
            <button
              onClick={toggleArabicVisibility}
              className="flex items-center space-x-2 
                text-sm font-medium 
                text-emerald-700 hover:text-emerald-900 
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 
                rounded mb-3 
                transition-colors duration-200
                cursor-pointer"
              aria-expanded={isArabicVisible}
              aria-controls={arabicContentId}
            >
              <EyeIcon className="w-5 h-5 flex-shrink-0" />
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
