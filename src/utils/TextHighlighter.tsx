"use client";

import React, { useEffect, useRef } from "react";
import Mark from "mark.js";

type Props = {
  text: string;
  highlight?: string;
  className?: string;
  as?: React.ElementType;
};

export function TextHighlighter({
  text,
  highlight,
  className = "",
  as: Component = "div",
}: Props) {
  const containerRef = useRef<HTMLElement>(null);

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
  }, [highlight, text]);

  return (
    <Component
      ref={containerRef}
      className={className}
    >
      {text}
    </Component>
  );
}
