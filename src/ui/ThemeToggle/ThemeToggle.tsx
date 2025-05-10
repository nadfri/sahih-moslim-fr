"use client";

import { useLayoutEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { ThemeType } from "@/src/types/types";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeType | null>(null);

  /*Pre Rendering*/
  useLayoutEffect(() => {
    const attributeValue = document.body.getAttribute("data-theme");

    if (attributeValue === "light" || attributeValue === "dark") {
      setTheme(attributeValue);
    }
  }, []);

  /*Handle Theme Change*/
  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    document.body.setAttribute("data-theme", newTheme);
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`; // 1 year
  }

  let IconTheme: React.ElementType | null = null;

  switch (theme) {
    case "light":
      IconTheme = SunIcon;
      break;
    case "dark":
      IconTheme = MoonIcon;
      break;
  }

  return (
    <button
      className="flex items-center justify-center rounded-full transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 p-1 size-8"
      onClick={toggleTheme}
      aria-label={`Toggle theme to ${theme === "light" ? "dark" : "light"}`}
      disabled={theme === null}
    >
      {IconTheme && <IconTheme className="w-full text-yellow-400 moveLeft" />}
    </button>
  );
}
