"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { highlightText } from "@/src/utils/highlightText";

type Props = {
  matn: string;
  highlight?: string;
  update?: boolean;
};

export function Matn_ar({ matn, update, highlight }: Props) {
  const [isArabicVisible, setIsArabicVisible] = useState(false);

  const arabicContentId = useId();

  const toggleArabicVisibility = () => {
    setIsArabicVisible(!isArabicVisible);
  };

  const processedMatnAr = highlightText(matn, highlight);

  return (
    <div className="mt-3 pt-2 border-t border-emerald-100 dark:border-emerald-900">
      {!update && (
        <button
          onClick={toggleArabicVisibility}
          className="flex items-center space-x-2 text-sm font-medium text-emerald-700 dark:text-emerald-500 hover:text-emerald-900 dark:hover:text-emerald-400 focus:outline-none rounded mb-3 transition-colors duration-200"
          aria-expanded={isArabicVisible}
          aria-controls={arabicContentId}
        >
          {isArabicVisible ? (
            <EyeOff
              className="w-5 h-5"
              aria-hidden="true"
            />
          ) : (
            <Eye
              className="w-5 h-5"
              aria-hidden="true"
            />
          )}
          <span>
            {isArabicVisible
              ? "Masquer la version arabe"
              : "Voir la version arabe"}
          </span>
        </button>
      )}

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
            className="pt-2 text-right font-matn_ar text-xl leading-loose text-pretty dark:text-gray-300"
            dir="rtl"
          >
            {processedMatnAr}
          </div>
        </div>
      </div>
    </div>
  );
}
