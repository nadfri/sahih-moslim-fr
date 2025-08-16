"use client";

import { ElementType, useEffect, useRef } from "react";
import Mark from "mark.js";

type HighlightProps = {
  html: string; // We now accept HTML
  highlight: string;
  as?: ElementType;
};

export function Highlighter({
  html,
  highlight,
  as: Component = "div",
}: HighlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && highlight) {
      const instance = new Mark(ref.current);
      instance.unmark({
        done: () => {
          instance.mark(highlight, {
            separateWordSearch: false,
            diacritics: true,
            accuracy: "exactly",
          });
        },
      });
    }
  }, [html, highlight]);

  return (
    <Component
      ref={ref}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
