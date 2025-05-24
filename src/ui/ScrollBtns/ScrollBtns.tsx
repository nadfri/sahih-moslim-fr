"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ScrollBtns() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      setShow(document.documentElement.scrollHeight > window.innerHeight);
    };

    checkScrollable();

    window.addEventListener("resize", checkScrollable);

    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollDown = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <div className="fixed flex flex-col gap-2 right-1 z-10 bottom-0 md:bottom-1/2 -translate-y-1/2">
      <button
        onClick={handleScrollUp}
        className="rounded-full bg-emerald-100/90 dark:bg-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-800/70"
      >
        <ChevronUp className="size-6 text-emerald-700/80 dark:text-emerald-400/50" />
      </button>

      <button
        onClick={handleScrollDown}
        className="rounded-full bg-emerald-100/90 dark:bg-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-800/70"
      >
        <ChevronDown className="size-6 text-emerald-700/80 dark:text-emerald-400/50" />
      </button>
    </div>
  );
}
