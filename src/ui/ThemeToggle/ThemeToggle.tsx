"use client";

import { useLayoutEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeToggle() {
  const initialTheme = localStorage.getItem("theme") || "dark";

  const [theme, setTheme] = useState(initialTheme);

  useLayoutEffect(() => {
    //useLayoutEffect prevent flash of light theme
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button
      className="flex items-center justify-center rounded-full transition-colors duration-300 hover:bg-gray-300  p-1"
      onClick={toggleTheme}
      aria-label={`Toggle theme to ${theme === "light" ? "dark" : "light"}`}
    >
      {theme === "light" ? (
        <SunIcon className="size-6 text-yellow-400" />
      ) : (
        <MoonIcon className="size-6 text-white/80" />
      )}
    </button>
  );
}
