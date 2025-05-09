"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Pencil, ScanEye, TriangleAlert } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { HadithType } from "@/src/types/types";
import { CopyBoard } from "@/src/ui/CopyBoard/CopyBoard";
import { ArabicIcon } from "@/src/ui/icons/ArabicIcon";

export function Hadith({
  hadith,
  update,
  highlight,
}: {
  hadith: HadithType;
  update?: boolean;
  highlight?: string;
}) {
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  const [isArabicVisible, setIsArabicVisible] = useState(false);

  // Helper to escape regex special chars in highlight string
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
  // Build case-insensitive regex for highlighting if a query is provided
  const highlightRegex = highlight
    ? new RegExp(`(${escapeRegExp(highlight)})`, "gi")
    : null;
  // Split text and wrap matched parts in a <mark> for highlighting
  const highlightParts = (text: string): (string | React.ReactNode)[] =>
    highlightRegex
      ? text.split(highlightRegex).map((part, i) =>
          highlightRegex.test(part) ? (
            <mark
              key={i}
              className="bg-yellow-200"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )
      : [text];

  // Preprocess markdown to wrap highlight matches in <mark> for raw HTML rendering
  const processedMatnFr = highlight
    ? hadith.matn_fr.replace(
        new RegExp(
          `(${highlight.replace(/[.*+?^${}()|[\\]\\]/g, "$&")})`,
          "gi"
        ),
        '<mark class="bg-yellow-200">$1</mark>'
      )
    : hadith.matn_fr;

  // Preprocess Arabic text similarly for raw HTML rendering
  const processedMatnAr = highlight
    ? hadith.matn_ar.replace(
        new RegExp(`(${escapeRegExp(highlight)})`, "gi"),
        '<mark class="bg-yellow-200">$1</mark>'
      )
    : hadith.matn_ar;

  const toggleArabicVisibility = () => {
    setIsArabicVisible(!isArabicVisible);
  };

  const arabicContentId = `matn_ar-content-${hadith.id}`;

  // Custom renderers for ReactMarkdown
  const customRenderers: Components = {
    // Override the default <strong> tag rendering
    strong: ({ ...props }) => (
      <span
        className="text-emerald-600 dark:text-emerald-400 font-medium"
        {...props}
      />
    ),
    // Override the default <em> tag rendering
    em: ({ ...props }) => (
      <em
        className="border-l-4 rounded-md border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30 p-3 my-4 text-amber-800 dark:text-amber-400 italic block"
        {...props}
      />
    ),
  };

  return (
    <div
      key={hadith.id}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl border-l-4 md:border-l-8 border-emerald-600 dark:border-emerald-700"
    >
      <div className="p-3 md:p-6">
        {/* Metadata Section (Chapter, ID, Narrator) */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <Link
              href={`/chapters/${hadith.chapter.slug}`}
              className="text-sm font-medium text-amber-700 dark:text-amber-500 tracking-wide uppercase inline-flex items-center hover:text-amber-900 dark:hover:text-amber-400 hover:underline transition-colors duration-200"
            >
              <ArabicIcon className="mr-1 h-5" /> {hadith.chapter.title}
            </Link>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 dark:bg-emerald-700 text-white text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                {hadith.numero}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Rapporté par{" "}
            <Link
              href={`/narrators/${hadith.narrator.slug}`}
              className="font-medium text-emerald-700 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400 hover:underline transition-colors duration-200"
            >
              {hadith.narrator.name}
            </Link>
          </p>
        </div>

        {/* matn_fr Section (Main text in French) */}
        <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed text-pretty">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={customRenderers} // Add the custom renderers here
          >
            {processedMatnFr}
          </ReactMarkdown>
        </div>

        {/* Mentioned Sahabas Section */}
        {hadith.mentionedSahabas && hadith.mentionedSahabas.length > 0 && (
          <div className="mt-5 pt-4 border-t border-emerald-100 dark:border-emerald-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-emerald-700 dark:text-emerald-500">
                Sahaba(s) mentionné(s) :
              </span>
            </p>

            <div className="flex flex-wrap gap-x-2 gap-y-2 mt-2">
              {hadith.mentionedSahabas.map((sahaba) => (
                <Link
                  key={sahaba.id}
                  href={`/sahabas/${sahaba.slug}`}
                  className="text-sm bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 px-2 py-1 rounded-md transition-colors duration-200 hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
                >
                  {highlight ? highlightParts(sahaba.name) : sahaba.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* matn_ar Section with toggle button and adaptive animation */}
        <div className="mt-5 pt-4 border-t border-emerald-100 dark:border-emerald-900">
          {!update && (
            <button
              onClick={toggleArabicVisibility}
              className="flex items-center space-x-2 text-sm font-medium text-emerald-700 dark:text-emerald-500 hover:text-emerald-900 dark:hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded mb-3 transition-colors duration-200"
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
                // Render processed Arabic HTML with highlights
                dangerouslySetInnerHTML={{ __html: processedMatnAr }}
              />
            </div>
          </div>
        </div>

        {/* Action buttons section */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          {/* Preview badge shown only in update mode */}
          {update && (
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

            {isDevelopment && (
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
      </div>
    </div>
  );
}
