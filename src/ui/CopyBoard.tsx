"use client";

import { useRef, useState } from "react";
import { Check, Files } from "lucide-react";

import { useClickOutside } from "../hooks/useClickOutside";

type CopyOption = "french" | "matn_ar" | "both";

export function CopyBoard({
  frenchText,
  arabicText,
  hadithNumber,
  narrator,
  chapter,
}: {
  frenchText: string;
  arabicText: string;
  hadithNumber: number | string;
  narrator: string;
  chapter: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Use the custom hook to handle clicks outside of the dropdown
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleCopy = (option: CopyOption) => {
    let textToCopy = "";

    // Create header with hadith info
    const header = `Sahih Moslim - Hadith n°${hadithNumber}\nChapitre: ${chapter}\nRapporté par: ${narrator}\n\n`;

    switch (option) {
      case "french":
        textToCopy = `${header}${frenchText}`;
        break;
      case "matn_ar":
        textToCopy = `${header}${arabicText}`;
        break;
      case "both":
        textToCopy = `${header}${frenchText}\n\n${arabicText}`;
        break;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    });
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-sm font-medium bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-md hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200"
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
        <div className="absolute z-50 bottom-0 right-0 bg-white rounded-md shadow-lg border border-emerald-100 flex flex-col min-w-fit overflow-hidden">
          <button
            onClick={() => handleCopy("french")}
            className="text-left px-3 py-2 text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-50 hover:text-emerald-800 transition-colors border-l-2 border-transparent hover:border-emerald-500"
          >
            Français
          </button>
          <button
            onClick={() => handleCopy("matn_ar")}
            className="text-left px-3 py-2 text-sm text-emerald-700 bg-emerald-100 hover:bg-emerald-100 hover:text-emerald-800 transition-colors border-l-2 border-transparent hover:border-emerald-500"
          >
            Arabe
          </button>
          <button
            onClick={() => handleCopy("both")}
            className="text-left px-3 py-2 text-sm text-emerald-700 bg-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 transition-colors border-l-2 border-transparent hover:border-emerald-500"
          >
            Les deux
          </button>
        </div>
      )}
    </div>
  );
}
