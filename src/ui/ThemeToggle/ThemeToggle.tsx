"use client";

import { ThemeType } from "@/src/types/types";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeType>(null);

  useEffect(() => {
    const dataTheme = document.documentElement.getAttribute(
      "data-theme"
    ) as ThemeType;
    setTheme(dataTheme || "dark");
  }, []);

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
      className="w-full sm:w-auto inline-flex items-center justify-center rounded-full transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 p-1"
      onClick={toggleTheme}
      aria-label={`Toggle theme to ${theme === "dark" ? "light" : "dark"}`}
      disabled={!theme}
    >
      <IconTheme className="text-yellow-400 moveLeft size-7" />
    </button>
  );
}
