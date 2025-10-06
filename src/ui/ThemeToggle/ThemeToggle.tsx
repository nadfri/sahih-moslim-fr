"use client";

import { ThemeType } from "@/src/types/types";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeType>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const dataTheme = document.documentElement.getAttribute(
      "data-theme"
    ) as ThemeType;
    setTheme(dataTheme || "dark");
  }, []);

  useEffect(() => {
    if (!theme) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    document.body.classList.add("fadeIn500ms");

    const timeoutId = setTimeout(() => {
      document.body.classList.remove("fadeIn500ms");
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [theme]);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", newTheme);

    localStorage.setItem("theme", newTheme);

    setTheme(newTheme);
  }

  let IconTheme: React.ElementType = SunMoonIcon;
  if (theme === "dark") IconTheme = MoonIcon;
  if (theme === "light") IconTheme = SunIcon;

  return (
    <button
      className="inline-flex items-center justify-center text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-200 -mx-0.5"
      onClick={toggleTheme}
      aria-label={`Toggle theme to ${theme === "dark" ? "light" : "dark"}`}
      disabled={!theme}
    >
      <IconTheme className="moveRight size-6" />
    </button>
  );
}
