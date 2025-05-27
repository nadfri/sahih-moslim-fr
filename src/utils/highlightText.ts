import React from "react";

import { escapeRegExp } from "./escapeRegExp";

// Process text to wrap highlight matches in <mark> elements for React rendering
export function highlightText(
  text: string,
  highlight?: string
): React.ReactNode {
  if (!highlight) return text;

  const regex = new RegExp(`(${escapeRegExp(highlight)})`, "gi");
  const parts = text.split(regex);

  return parts
    .filter((part) => part !== "")
    .map((part, index) => {
      if (part.toLowerCase() === highlight.toLowerCase()) {
        return React.createElement(
          "mark",
          {
            key: index,
            className: "bg-yellow-200",
          },
          part
        );
      }
      return part;
    });
}

// Keep the old function for backward compatibility where HTML string is needed
export function highlightTextAsHTML(text: string, highlight?: string): string {
  return highlight
    ? text.replace(
        new RegExp(`(${escapeRegExp(highlight)})`, "gi"),
        '<mark class="bg-yellow-200">$1</mark>'
      )
    : text;
}
