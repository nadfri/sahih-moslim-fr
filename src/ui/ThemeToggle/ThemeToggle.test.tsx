import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { ThemeToggle } from "./ThemeToggle";

function setHtmlTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
}

function getHtmlTheme(): string | null {
  return document.documentElement.getAttribute("data-theme");
}

describe("ThemeToggle (standalone)", () => {
  beforeEach(() => {
    // default to light for tests
    setHtmlTheme("light");
    localStorage.clear();
  });

  it("renders and shows correct aria-label for current theme", () => {
    render(<ThemeToggle />);

    const btn = screen.getByRole("button");
    expect(btn).toBeEnabled();
    expect(btn).toHaveAttribute("aria-label", expect.stringContaining("dark"));
  });

  it("toggles theme from light to dark and updates documentElement and localStorage", async () => {
    render(<ThemeToggle />);

    const btn = screen.getByRole("button");
    await userEvent.click(btn);

    expect(getHtmlTheme()).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(btn).toHaveAttribute("aria-label", expect.stringContaining("light"));
  });

  it("toggles theme from dark to light and updates documentElement and localStorage", async () => {
    setHtmlTheme("dark");

    render(<ThemeToggle />);

    const btn = screen.getByRole("button");
    await userEvent.click(btn);

    expect(getHtmlTheme()).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(btn).toHaveAttribute("aria-label", expect.stringContaining("dark"));
  });

  it("provider initialise le thème par défaut à 'dark' si data-theme absent", async () => {
    document.documentElement.removeAttribute("data-theme");

    render(<ThemeToggle />);

    // Attendre que le bouton ait l'aria-label pour passer au thème clair (donc thème courant = dark)
    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toHaveAttribute(
        "aria-label",
        expect.stringContaining("light")
      );
    });
  });
});
