"use client";

import { useRef, useState } from "react";
import { Check, Files, LinkIcon } from "lucide-react";

import { useClickOutside } from "@/src/hooks/useClickOutside";
import { HadithType } from "@/src/types/types";

type CopyOption = "fr" | "ar" | "both" | "link";

// Accept hadith as a prop
export function CopyBoard({ hadith }: { hadith: HadithType }) {
  // Extract fields from hadith
  const frenchText = hadith.matn_fr;
  const arabicText = hadith.matn_ar;
  const hadithNumber = hadith.numero;
  const narrator = hadith.narrator.name;
  const chapter = hadith.chapter.name;

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Use the custom hook to handle clicks outside of the dropdown
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Make handleCopy async and await clipboard write
  const handleCopy = async (option: CopyOption) => {
    let textToCopy = "";

    // Create header with hadith info
    const header = `Sahih Moslim - Hadith n°${hadithNumber}\nChapitre: ${chapter}\nRapporté par: ${narrator}\n\n`;

    switch (option) {
      case "fr":
        textToCopy = `${header}${frenchText}`;
        break;
      case "ar":
        textToCopy = `${header}${arabicText}`;
        break;
      case "both":
        textToCopy = `${header}${frenchText}\n\n${arabicText}`;
        break;
      case "link":
        // Copy the full absolute URL instead of a relative link
        textToCopy = `${window.location.origin}/hadiths/${hadithNumber}`;
        break;
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
        title="Copier le hadith"
        aria-label="Copier le contenu du hadith"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {copied ? (
          <Check
            className="h-4 w-4"
            aria-hidden="true"
          />
        ) : (
          <Files
            className="h-4 w-4"
            aria-hidden="true"
          />
        )}
        <span>{copied ? "Copié!" : "Copier"}</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-0 right-0 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-emerald-100 dark:border-emerald-900 flex flex-col min-w-fit overflow-hidden">
          <button
            onClick={() => handleCopy("fr")}
            className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600"
          >
            Français
          </button>
          <button
            onClick={() => handleCopy("ar")}
            className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/70 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600"
          >
            Arabe
          </button>
          <button
            onClick={() => handleCopy("both")}
            className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-200 dark:bg-emerald-900/90 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600"
          >
            Les deux
          </button>
          <button
            onClick={() => handleCopy("link")}
            className="text-left px-3 py-2 text-sm text-emerald-700 dark:text-emerald-500 bg-emerald-300/75 dark:bg-emerald-800/90 transition-colors border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-600 inline-flex items-center gap-1.5"
          >
            Le lien
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
