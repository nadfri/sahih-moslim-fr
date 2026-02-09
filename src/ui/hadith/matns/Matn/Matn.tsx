"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { MarkdownHighlighter } from "@/src/ui/hadith/MarkdownHighlighter/MarkdownHighlighter";
import { containsArabic } from "@/src/utils/normalizeArabicText";
import { wrapArabicProphetNames } from "@/src/utils/wrapProphetNamesMultilingual";
import { wrapEnglishProphetNames } from "@/src/utils/wrapProphetNamesMultilingual";
import {
  formatHadithNarration,
  splitIntoParagraphs,
} from "../utils/formatEnglishText";

type MatnProps = {
  matn: string;
  lang: "fr" | "en" | "ar";
  highlight?: string;
  showToggle?: boolean;
  id?: string;
};

export function Matn({ matn, lang, highlight, showToggle = false }: MatnProps) {
  const t = useTranslations("hadith.ActionsBtns");

  // Auto-show if searching for text in that language
  const shouldAutoShow =
    highlight &&
    ((lang === "ar" && containsArabic(highlight)) || lang !== "ar");
  const [isVisible, setIsVisible] = useState(shouldAutoShow || !showToggle);

  // Deterministic ID to prevent hydration mismatch
  const contentId = `matn-${lang}-${Math.abs(matn.length)}`;

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Render based on language
  if (lang === "ar") {
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

  if (lang === "en") {
    const hasManualParagraphs = matn.includes("\n\n");

    let paragraphs: string[];

    if (hasManualParagraphs) {
      paragraphs = matn
        .split("\n\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
    } else {
      const formattedText = formatHadithNarration(matn);
      paragraphs = splitIntoParagraphs(formattedText);
    }

    if (paragraphs.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-pretty">
        {paragraphs.map((paragraph, index) => {
          const prophetFormattedParagraph = wrapEnglishProphetNames(paragraph);
          return (
            <div
              key={index}
              className="text-base"
            >
              <MarkdownHighlighter highlight={highlight}>
                {prophetFormattedParagraph}
              </MarkdownHighlighter>
            </div>
          );
        })}
      </div>
    );
  }

  // French (default)
  return (
    <MarkdownHighlighter highlight={highlight}>{matn}</MarkdownHighlighter>
  );
}
