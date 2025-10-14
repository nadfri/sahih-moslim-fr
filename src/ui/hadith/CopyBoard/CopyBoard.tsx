"use client";

import { useRef, useState } from "react";
import { Check, Files, LinkIcon } from "lucide-react";

import { useClickOutside } from "@/src/hooks/useClickOutside";
import { HadithType } from "@/src/types/types";
import { getNarratorName } from "@/src/utils/getNarratorName";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedName } from "@/src/utils/getLocalizedName";

type CopyOption = "fr" | "ar" | "en" | "both" | "link";

// Accept hadith as a prop
export function CopyBoard({ hadith }: { hadith: HadithType }) {
  const t = useTranslations("hadith.ActionsBtns");
  const locale = useLocale();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Use the custom hook to handle clicks outside of the dropdown
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Make handleCopy async and await clipboard write
  const handleCopy = async (option: CopyOption) => {
    let textToCopy = "";

    // Create header with hadith info
    const header = t("header-copy", {
      numero: hadith.numero,
      chapter: getLocalizedName(hadith.chapter, locale),
      narrator: getNarratorName(hadith, locale) ?? "",
    });

    switch (option) {
      case "fr":
        textToCopy = `${header}${hadith.matn_fr}`;
        break;
      case "en":
        textToCopy = `${header}${hadith.matn_en || ""}`;
        break;
      case "ar":
        textToCopy = `${header}${hadith.matn_ar}`;
        break;
      case "both": {
        const primaryText =
          locale === "fr" ? hadith.matn_fr : hadith.matn_en || hadith.matn_fr;
        textToCopy = `${header}${primaryText}\n\n${hadith.matn_ar}`;
        break;
      }
      case "link": {
        // Copy the full absolute URL with correct locale
        const baseUrl = window.location.origin;
        textToCopy = `${baseUrl}/${locale}/hadith/${hadith.numero}`;
        break;
      }
    }

    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      data-testid="copy-board"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-sm font-medium bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-800/60 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-200"
        title={t("copy-aria")}
        aria-label={t("copy-aria")}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {copied ? (
          <Check
            className="size-4"
            aria-hidden="true"
          />
        ) : (
          <Files
            className="size-4"
            aria-hidden="true"
          />
        )}
        <span>{copied ? t("copied") : t("copy")}</span>
      </button>

      {isOpen && locale !== "ar" && (
        <div className="absolute z-50 bottom-0 end-0 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-emerald-100 dark:border-emerald-900 flex flex-col min-w-fit overflow-hidden">
          {/* Options selon la locale */}
          {locale === "fr" && (
            <>
              <button
                onClick={() => handleCopy("fr")}
                className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600"
              >
                {t("french")}
              </button>
              <button
                onClick={() => handleCopy("ar")}
                className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/70 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600"
              >
                {t("arabic")}
              </button>
              <button
                onClick={() => handleCopy("both")}
                className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-200 dark:bg-emerald-900/90 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600"
              >
                {t("both")}
              </button>
            </>
          )}

          {locale === "en" && (
            <>
              <button
                onClick={() => handleCopy("en")}
                className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600"
              >
                {t("english")}
              </button>
              <button
                onClick={() => handleCopy("ar")}
                className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/70 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600"
              >
                {t("arabic")}
              </button>
              <button
                onClick={() => handleCopy("both")}
                className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-200 dark:bg-emerald-900/90 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600"
              >
                {t("both")}
              </button>
            </>
          )}

          {/* Option lien toujours disponible */}
          <button
            onClick={() => handleCopy("link")}
            className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-300/75 dark:bg-emerald-800/90 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600 inline-flex items-center gap-1.5"
          >
            {t("link")}
            <LinkIcon
              size={12}
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      {/* Dropdown pour locale arabe : copie directe de l'arabe + option lien */}
      {isOpen && locale === "ar" && (
        <div className="absolute z-50 bottom-0 end-0 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-emerald-100 dark:border-emerald-900 flex flex-col min-w-fit overflow-hidden">
          <button
            onClick={() => handleCopy("ar")}
            className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600"
          >
            {t("arabic")}
          </button>
          <button
            onClick={() => handleCopy("link")}
            className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-300/75 dark:bg-emerald-800/90 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600 inline-flex items-center gap-1.5"
          >
            {t("link")}
            <LinkIcon
              size={12}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </div>
  );
}
