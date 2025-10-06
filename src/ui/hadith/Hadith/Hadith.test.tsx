import { renderWithI18n } from "@/__tests__/renderWithI18n";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockHadith } from "@/src/mocks/mockHadith";
import type { HadithType } from "@/src/types/types";
import { Hadith } from "./Hadith";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      className={className}
      data-testid="mock-link"
    >
      {children}
    </a>
  ),
}));

// Mock the environment variables
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      className={className}
      data-testid="mock-link"
    >
      {children}
    </a>
  ),
}));

// Mock the CopyBoard component - Keep the mock simple or as needed
vi.mock("@/src/ui/CopyBoard/CopyBoard", () => ({
  // We need a named export 'CopyBoard' that is a mock function
  CopyBoard: vi.fn(() => <div data-testid="copy-board">Mock CopyBoard</div>),
}));

describe("Hadith", () => {
  // Sample hadith data for testing with all required properties

  // Set NODE_ENV to development for testing the edit link
  beforeEach(() => {
    // Clear mock calls before each test
    vi.clearAllMocks();
  });

  it("renders the hadith basic information correctly", () => {
    renderWithI18n(
      <Hadith
        hadith={mockHadith}
        isAdmin={false}
      />
    );

    // Check chapter title
    expect(screen.getByText("Test Chapter")).toBeInTheDocument();

    // Check hadith number
    expect(screen.getByText("123")).toBeInTheDocument();

    // Check hadith text (with markdown rendered)
    expect(
      screen.getByText("Ceci est un", { exact: false })
    ).toBeInTheDocument();

    // Check sahabas
    expect(screen.getByText("Sahaba Test 1")).toBeInTheDocument();
    expect(screen.getByText("Sahaba Test 2")).toBeInTheDocument();
  });

  it("toggles Arabic text visibility when button is clicked", async () => {
    const user = userEvent.setup();
    renderWithI18n(
      <Hadith
        hadith={mockHadith}
        isAdmin={false}
      />
    );

    // Initially, Arabic should be hidden — check aria-expanded and opacity class
    const toggleButton = screen.getByRole("button", {
      name: /voir la version arabe/i,
    });
    expect(toggleButton).toBeInTheDocument();

    const arabicContent = screen.getByText("هذا اختبار للحديث باللغة العربية");
    const arabicContainer = arabicContent.closest("div[id]");

    // When hidden, aria-expanded is false on the toggle and the container has opacity-0
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
    expect(arabicContainer?.className).toContain("opacity-0");

    // Click to show Arabic
    await user.click(toggleButton);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("true");
    expect(arabicContainer?.className).toContain("opacity-100");
    expect(screen.getByText("Masquer la version arabe")).toBeInTheDocument();

    // Click again to hide
    await user.click(toggleButton);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
    expect(arabicContainer?.className).toContain("opacity-0");
  });

  it("highlights text when highlight prop is provided", () => {
    renderWithI18n(
      <Hadith
        hadith={mockHadith}
        highlight="test"
        isAdmin={false}
      />
    );

    // The highlighted text should be wrapped in <mark> tags
    const marks = document.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThan(0);

    // Ensure at least one <mark> contains the highlight term
    const hasMarkWithHighlight = Array.from(marks).some((m) =>
      /test/i.test(m.textContent || "")
    );
    expect(hasMarkWithHighlight).toBe(true);
  });

  it("shows preview badge in update mode", () => {
    renderWithI18n(
      <Hadith
        hadith={mockHadith}
        edit={true}
        isAdmin={false}
      />
    );

    // Check for preview badge
    expect(screen.getByText("Aperçu")).toBeInTheDocument();
  });

  it("shows edit link for admin users", () => {
    renderWithI18n(
      <Hadith
        hadith={mockHadith}
        isAdmin={true}
      />
    );

    // Edit link should be visible (use data-testid to locate links)
    const links = screen.getAllByTestId("mock-link");
    const editLink = links.find(
      (l) => l.getAttribute("href") === "/hadith/123/edit"
    );
    expect(editLink).toBeDefined();
  });

  it("doesn't show edit link for non-admin users", () => {
    renderWithI18n(
      <Hadith
        hadith={mockHadith}
        isAdmin={false}
      />
    );

    // Edit link should not be visible
    const links = screen.getAllByTestId("mock-link");
    const editLink = links.find(
      (l) => l.getAttribute("href") === "/hadith/123/edit"
    );
    expect(editLink).toBeUndefined();
  });

  it("renders custom markdown styling correctly", () => {
    const hadithWithMarkdown: HadithType = {
      ...mockHadith,
      matn_fr: "Normal text with **bold text** and *italic block quote*",
    };

    renderWithI18n(
      <Hadith
        hadith={hadithWithMarkdown}
        isAdmin={false}
      />
    );

    // Check strong tag styling
    const strongElement = screen.getByText("bold text");
    expect(strongElement.className).toContain("text-emerald-600");

    // Check em tag styling
    const emElement = screen.getByText("italic block quote");
    expect(emElement.className).toContain("border-amber-500");
  });

  it("renders the report button", async () => {
    const user = userEvent.setup();
    renderWithI18n(
      <Hadith
        hadith={mockHadith}
        isAdmin={false}
      />
    );

    const reportButton = screen.getByText("Signaler");
    expect(reportButton).toBeInTheDocument();

    // We can't fully test the onClick functionality since it's not implemented yet,
    // but we can test that the button is clickable
    await user.click(reportButton);
  });
});
