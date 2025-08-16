"use client";

import { useEffect, useRef } from "react";
import Mark from "mark.js";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

type Props = {
  children: string;
  highlight?: string;
  components?: Components;
};

export function MarkdownHighlighter({
  children,
  highlight,
  components,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !highlight) return;

    const markInstance = new Mark(containerRef.current);

    // Clear previous highlights
    markInstance.unmark();

    // Apply new highlights with options for accent-insensitive search
    markInstance.mark(highlight, {
      accuracy: "partially",
      ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
      ignoreJoiners: true,
      separateWordSearch: false,
      diacritics: true, // This enables accent-insensitive search
      className: "bg-yellow-200 dark:bg-yellow-600",
    });

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
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
