import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { ThemeType } from "@/src/types/types";
import { ThemeToggle } from "./ThemeToggle";

// Helper to set/reset document.body attribute and cookie
function setBodyTheme(theme: ThemeType) {
  document.body.setAttribute("data-theme", theme);
}

function getBodyTheme(): ThemeType | null {
  const attr = document.body.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return null;
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.body.setAttribute("data-theme", "light");
    document.cookie = "";
  });

  it("renders the button and icon according to current theme", () => {
    setBodyTheme("light");
    render(<ThemeToggle />);
    // Button should be enabled
    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
    // Sun icon should be present for light theme
    expect(button.querySelector("svg")).toBeInTheDocument();
    // Aria-label should indicate switching to dark
    expect(button).toHaveAttribute(
      "aria-label",
      expect.stringContaining("dark")
    );
  });

  it("toggles theme from light to dark and updates body attribute and cookie", async () => {
    setBodyTheme("light");
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    // Theme should now be dark
    expect(getBodyTheme()).toBe("dark");
    // Aria-label should indicate switching to light
    expect(button).toHaveAttribute(
      "aria-label",
      expect.stringContaining("light")
    );
    // Cookie should be set
    expect(document.cookie).toContain("theme=dark");
  });

  it("toggles theme from dark to light and updates body attribute and cookie", async () => {
    setBodyTheme("dark");
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(getBodyTheme()).toBe("light");
    expect(button).toHaveAttribute(
      "aria-label",
      expect.stringContaining("dark")
    );
    expect(document.cookie).toContain("theme=light");
  });

  it("button is disabled if theme is not detected", () => {
    document.body.removeAttribute("data-theme");
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
