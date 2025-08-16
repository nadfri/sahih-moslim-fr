"use client";

import { useEffect, useRef } from "react";
import Mark from "mark.js";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { prepareArabicForHighlight } from "@/src/utils/normalizeArabicText";

type Props = {
  children: string;
  highlight?: string;
};

export function MarkdownHighlighter({ children, highlight }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom renderers for ReactMarkdown (moved inside client component)
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

    // Override the default <s> tag rendering
    del: ({ ...props }) => (
      <del
        className="text-blue-600 dark:text-blue-500 no-underline font-medium"
        {...props}
      />
    ),
  };

  useEffect(() => {
    if (!containerRef.current || !highlight) return;

    const markInstance = new Mark(containerRef.current);

    // Clear previous highlights
    markInstance.unmark();

    // Normalize Arabic text for better highlighting
    const normalizedHighlight = prepareArabicForHighlight(highlight);

    // Check if we're dealing with Arabic text
    const isArabic = /[\u0600-\u06FF]/.test(highlight);

    if (isArabic) {
      // For Arabic text, use manual DOM manipulation for better diacritics handling
      const container = containerRef.current;
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

      const textNodes: Text[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (node.nodeType === Node.TEXT_NODE) {
          textNodes.push(node as Text);
        }
      }

      // Process each text node for Arabic highlighting
      textNodes.forEach((textNode) => {
        const originalText = textNode.textContent || "";
        
        // Create a regex pattern that matches the search term with optional diacritics
        const searchTerm = normalizedHighlight;
        const pattern = searchTerm
          .split("")
          .map((char) => {
            if (/[\u0600-\u06FF]/.test(char)) {
              // Add optional diacritics after each Arabic character
              return char + "[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED]*";
            }
            return char;
          })
          .join("");

        const regex = new RegExp(`(${pattern})`, "gi");
        
        if (regex.test(originalText)) {
          const highlightedText = originalText.replace(
            regex,
            '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>'
          );
          
          if (highlightedText !== originalText) {
            const span = document.createElement("span");
            span.innerHTML = highlightedText;
            textNode.parentNode?.replaceChild(span, textNode);
          }
        }
      });
    } else {
      // For non-Arabic text, use standard highlighting
      markInstance.mark(highlight, {
        accuracy: "partially",
        ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
        ignoreJoiners: true,
        separateWordSearch: false,
        diacritics: true,
        className: "bg-yellow-200 dark:bg-yellow-600",
      });
    }

    // Cleanup function
    return () => {
      markInstance.unmark();
    };
  }, [highlight, children]);

  return (
    <div ref={containerRef}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={customRenderers}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
