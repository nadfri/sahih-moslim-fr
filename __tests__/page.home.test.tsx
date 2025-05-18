// filepath: e:\DEV\sahih-moslim-fr\app\page.home.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

// Tests for Home page component
describe("Home", () => {
  // Test for the main title
  it("renders the main title", async () => {
    // Home is a server component (async), so we need to await its promise
    const ui = await Home();
    render(<>{ui}</>);
    expect(
      screen.getByRole("heading", { name: /Sahih Moslim en français/i })
    ).toBeInTheDocument();
  });

  // Test for the welcome paragraph
  it("renders the welcome paragraph", async () => {
    const ui = await Home();
    render(<>{ui}</>);
    expect(
      screen.getByText(/soigneusement vérifiés et classés par thèmes/i)
    ).toBeInTheDocument();
  });

  // Test for the badge with the number of hadiths
  it("renders the badge with the number of hadiths", async () => {
    const ui = await Home();
    render(<>{ui}</>);
    // Find the badge by its number (should match the number of hadiths in the test db)
    expect(screen.getByText("28")).toBeInTheDocument();
  });

  // Test for correct display of hadiths (checks for at least one hadith badge)
  it("renders at least one hadith badge", async () => {
    const ui = await Home();
    render(<>{ui}</>);
    // Find all spans with the hadith badge class (Tailwind + your markup)
    const badges = screen.getAllByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === "span" &&
        element.className.includes("bg-emerald-600") &&
        /^\d+$/.test(content.trim())
      );
    });
    expect(badges.length).toBeGreaterThan(0);
  });

  // Test: all hadiths have a unique number
  it("renders unique hadith numbers", async () => {
    const ui = await Home();
    render(<>{ui}</>);
    // Select all spans with the badge class
    const badges = screen.getAllByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === "span" &&
        element.className.includes("bg-emerald-600") &&
        /^\d+$/.test(content.trim())
      );
    });
    // Check that all badge numbers are unique
    const numbers = badges.map((el) => el.textContent?.trim());
    const unique = new Set(numbers);
    expect(unique.size).toBe(numbers.length);
  });
});
