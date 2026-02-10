"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { MarkdownHighlighter } from "@/src/ui/hadith/MarkdownHighlighter/MarkdownHighlighter";
import { containsArabic } from "@/src/utils/normalizeArabicText";
import { wrapArabicProphetNames } from "@/src/utils/wrapProphetNamesMultilingual";

type Props = {
  matn: string;
  highlight?: string;
  showToggle?: boolean;
};

export function Matn_ar({ matn, highlight, showToggle = true }: Props) {
  const t = useTranslations("hadith.ActionsBtns");

  // Auto-show if searching for Arabic text
  const shouldAutoShow = highlight && containsArabic(highlight);
  const [isVisible, setIsVisible] = useState(shouldAutoShow || !showToggle);

  // Deterministic ID to prevent hydration mismatch
  const contentId = `matn-ar-${Math.abs(matn.length)}`;

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div
      className={
        showToggle
          ? "mt-4 pt-2 border-t border-emerald-100 dark:border-emerald-900"
          : ""
      }
    >
      {showToggle && (
        <button
          onClick={toggleVisibility}
          className="flex items-center space-x-2 text-sm font-medium text-emerald-700 dark:text-emerald-500 hover:text-emerald-900 dark:hover:text-emerald-400 rounded mb-3 transition-colors duration-200"
          aria-expanded={isVisible}
          aria-controls={contentId}
        >
          {isVisible ? (
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
          <span>{isVisible ? t("hide-arabic") : t("see-arabic")}</span>
        </button>
      )}

      <div
        id={contentId}
        className={
          showToggle
            ? `
                grid                      
                transition-[grid-template-rows,opacity]
                duration-500             
                ease-in-out              
                ${isVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
              `
            : ""
        }
      >
        <div className={showToggle ? "overflow-hidden" : ""}>
          <div
            className="pt-2 text-right text-xl leading-loose text-pretty dark:text-gray-300"
            dir="rtl"
          >
            <MarkdownHighlighter highlight={highlight}>
              {wrapArabicProphetNames(matn)}
            </MarkdownHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}
